from rest_framework import serializers
from .models import Badge, UserBadge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon']

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()
    
    class Meta:
        model = UserBadge
        fields = ['badge', 'awarded_at']