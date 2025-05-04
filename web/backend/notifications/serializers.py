from rest_framework import serializers
from .models import Notification, Feedback
from users.models import User
from routes.models import Route

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault()
    )
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'message',
            'category',
            'is_read',
            'created_at'
        ]
        read_only_fields = ['created_at', 'user']
        extra_kwargs = {
            'message': {'required': True},
            'category': {'required': True}
        }


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )
    
    route = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(),
        required=False,
        allow_null=True
    )
    
    travel_buddy = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Feedback
        fields = [
            'id',
            'user',
            'route',
            'travel_buddy',
            'message',
            'created_at'
        ]
        read_only_fields = ['created_at', 'user']
        extra_kwargs = {
            'message': {'required': True, 'max_length': 500}
        }