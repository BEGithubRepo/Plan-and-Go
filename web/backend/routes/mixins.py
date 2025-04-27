# routes/mixins.py

from django.db.models import Q  
from rest_framework import mixins, viewsets
from .permissions import IsRouteOwnerOrReadOnly, IsCollaboratorOrOwner

class OwnerEditMixin:
    """
    Sadece sahibin düzenleyebileceği mixin
    """
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

class CollaborativeEditMixin(viewsets.GenericViewSet):
    """
    İşbirlikçi düzenleme yetkisi ekler
    """
    permission_classes = [IsCollaboratorOrOwner]

    def get_queryset(self):
        return super().get_queryset().filter(
            Q(user=self.request.user) | 
            Q(collaborators__in=[self.request.user])
        ).distinct()