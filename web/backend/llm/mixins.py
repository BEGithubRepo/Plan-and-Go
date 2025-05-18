from rest_framework import permissions

class AuthenticationMixin:
    permission_classes = [permissions.IsAuthenticated]