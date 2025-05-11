from django.urls import include, path
from .views import (
    FeedbackCreate, 
    NotificationList,
    CommentCreate)

urlpatterns = [
    path('api/', include([
        path('notifications/', NotificationList.as_view(), name='notification-list'),
        path('feedback/', include([
            path('create/', FeedbackCreate.as_view(), name='feedback-create')
        ])),
        path('comment/', include([
            path('create/', CommentCreate.as_view(), name='comment-create')
            # path('update/', )
        ]))
    ]))
]