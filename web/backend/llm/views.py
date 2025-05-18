import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import ChatHistory
from .serializers import ChatHistorySerializer
from .mixins import AuthenticationMixin

class LLMInteractionView(AuthenticationMixin, APIView):
    
    def post(self, request):
        serializer = ChatHistorySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ortam değişkenlerinden ayarları al
            api_url = settings.OLLAMA_API_URL
            model = settings.OLLAMA_MODEL
            timeout = settings.OLLAMA_TIMEOUT

            # API URL kontrolü
            if not api_url:
                raise ValueError("OLLAMA_API_URL environment variable not configured")

            # Ollama API isteği
            response = requests.post(
                api_url,
                json={
                    "model": model,
                    "prompt": serializer.validated_data['prompt'],
                    "stream": False
                },
                timeout=timeout
            )
            response.raise_for_status()

            # Yanıtı kaydet
            chat = ChatHistory.objects.create(
                user=request.user,
                prompt=serializer.validated_data['prompt'],
                response=response.json()['response']
            )

            return Response({
                "response": chat.response,
                "created_at": chat.created_at
            }, status=status.HTTP_200_OK)

        except requests.exceptions.ConnectionError as e:
            error_msg = f"Ollama connection error: {str(e)}"
            return Response({"error": error_msg}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except requests.exceptions.Timeout as e:
            error_msg = f"Ollama request timeout ({settings.OLLAMA_TIMEOUT}s)"
            return Response({"error": error_msg}, status=status.HTTP_504_GATEWAY_TIMEOUT)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)