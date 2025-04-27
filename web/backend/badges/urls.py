# badges/urls.py

from django.urls import path, include
from .views import UserBadgeListView, UserBadgeDetailAPIView, UserBadgeListAPIView

urlpatterns = [
    path('badges/', UserBadgeListView.as_view(), name='user-badges'),
    path('api/', include([
        path('user/', include([
            path('badges/', UserBadgeListAPIView.as_view(), name='user-badges'),
            path('badges/<int:pk>/', UserBadgeDetailAPIView.as_view(), name='user-badges'),
           
        ])),
    ])),
]

