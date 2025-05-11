# notifications/views.py

from rest_framework import generics, permissions
from .models import Notification, Comment
from .serializers import (
    NotificationSerializer, 
    FeedbackSerializer,
    CommentSerializer)

class NotificationList(generics.ListAPIView):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class MarkAsReadView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    
    def perform_update(self, serializer):
        serializer.instance.is_read = True
        serializer.save()

class CommentCreate(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedbackCreate(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)