# routes/permissions.py

from rest_framework import permissions

class IsRouteOwnerOrReadOnly(permissions.BasePermission):
    """
    Sadece rota sahibinin düzenleme yapabilmesini sağlar.
    Diğer kullanıcılar sadece görüntüleyebilir.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class IsCollaboratorOrOwner(permissions.BasePermission):
    """
    Sadece rota sahibi veya işbirlikçiler düzenleme yapabilir.
    """
    def has_object_permission(self, request, view, obj):
        return request.user in obj.collaborators.all() or obj.user == request.user