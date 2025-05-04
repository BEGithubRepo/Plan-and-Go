from django.urls import include, path
from .views import FeedbackCreate, NotificationList

urlpatterns = [
    path('api/', include([
        path('notifications/', NotificationList.as_view(), name='notification-list'),
        path('feedback/', include([
            path('create/', FeedbackCreate.as_view(), name='feedback-create')
        ])),
    ]))
]