# badges/views.py

from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import UserBadge
from .serializers import UserBadgeSerializer

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class UserBadgeListAPIView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class UserBadgeDetailAPIView(generics.RetrieveAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)