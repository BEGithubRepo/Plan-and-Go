from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

class RouteViewSet(ModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Route.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)