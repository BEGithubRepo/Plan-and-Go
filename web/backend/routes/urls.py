# routes/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet

router = DefaultRouter()
router.register(r'routes', RouteViewSet, basename='route')

urlpatterns = [
    path('api/routes/shared/<uuid:share_token>/', 
         RouteViewSet.as_view({'get': 'shared_route_detail'}), 
         name='shared-route-detail'),
] 

urlpatterns += router.urls