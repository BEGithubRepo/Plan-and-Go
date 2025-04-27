# users/permissions.py

from rest_framework import permissions

class ActivityAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Sadece authenticated kullanıcılar erişebilir
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin tüm aktivitelere erişebilir
        if request.user.is_staff:
            return True
        # Kullanıcı sadece kendi aktivitelerini görebilir
        return obj.user == request.user