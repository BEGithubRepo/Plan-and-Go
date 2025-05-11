# badges/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserBadgeListView, 
    UserBadgeDetailAPIView, 
    UserBadgeListAPIView,
    BadgeTradeViewSet)

router = DefaultRouter()
router.register(r'trades', BadgeTradeViewSet, basename='badge-trade')
# GET /api/trades/ - Tüm takasları listeler
# POST /api/trades - Yeni takas oluşturur
# GET/PATCH /api/trades/{id}/ - Takas detayı ve güncelleme


urlpatterns = [
    path('badges/', UserBadgeListView.as_view(), name='user-badges'),
    path('api/', include(router.urls)),
    path('api/', include([
        path('user/', include([
            path('badges/', UserBadgeListAPIView.as_view(), name='user-badges'),
            path('badges/<int:pk>/', UserBadgeDetailAPIView.as_view(), name='user-badges'),
           
        ])),
    ])),
]

