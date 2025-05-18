from rest_framework import serializers
from .models import ChatHistory

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['prompt', 'response']
        read_only_fields = ['response']
        extra_kwargs = {
            'user': {'write_only': True}
        }