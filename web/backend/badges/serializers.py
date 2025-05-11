# badges/serializers.py

from rest_framework import serializers
from .models import BadgeTrade, TradeBadge, UserBadge
from django.utils.translation import gettext_lazy as _

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ('id', 'name', 'description', 'image', 'created')

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ('badge', 'earned_at')

class BadgeTradeSerializer(serializers.ModelSerializer):
    badges = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=UserBadge.objects.all(),
        write_only=True,
        help_text=_("List of badge IDs to trade (must be owned by sender)")
    )
    receiver = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        help_text=_("ID of the user receiving the trade offer")
    )
    
    class Meta:
        model = BadgeTrade
        fields = [
            'id',
            'sender',
            'receiver',
            'badges',
            'status',
            'message',
            'created',
            'modified'
        ]
        read_only_fields = ['sender', 'status', 'created', 'modified']

    def validate(self, data):
        sender = self.context['request'].user
        badges = data.get('badges', [])
        
        invalid_badges = [
            badge.id 
            for badge in badges 
            if not UserBadge.objects.filter(user=sender, badge=badge.badge).exists()
        ]
        
        if invalid_badges:
            raise serializers.ValidationError({
                'badges': _("You don't own badges with IDs: %(badges)s") % {'badges': invalid_badges}
            })
        
        return data

    def create(self, validated_data):
        badges = validated_data.pop('badges', [])
        trade = BadgeTrade.objects.create(**validated_data)
        
        for user_badge in badges:
            TradeBadge.objects.create(trade=trade, badge=user_badge.badge)
        
        return trade