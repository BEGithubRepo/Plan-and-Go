from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserBadge
from .serializers import UserBadgeSerializer

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)