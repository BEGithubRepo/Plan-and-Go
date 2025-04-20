from django.urls import path
from .views import RouteViewSet

urlpatterns = [
    path('routes/', RouteViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('routes/<int:pk>/', RouteViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    })),
]