# badges/services.py

from .models import Badge, UserBadge
from .strategies import (
    ActivityCountStrategy,
    EventBasedStrategy,
)

class BadgeAwardService:
    STRATEGY_MAPPING = {
        "activity_based": ActivityCountStrategy(),
        "event_based": EventBasedStrategy(),
    }

    @classmethod
    def get_eligible_badges(cls, user, **context):
        # Context'e göre filtreleme yap
        activity_type = context.get("activity_type")
        
        # Eğer activity_type varsa, sadece "activity_based" kriterli rozetleri getir
        if activity_type:
            badges = Badge.objects.filter(criteria__type="activity_based")
        # Yoksa "event_based" rozetleri getir (ör: kullanıcı oluşturma)
        else:
            badges = Badge.objects.filter(criteria__type="event_based")
        
        # Filtrelenmiş rozetleri kontrol et
        eligible_badges = []
        for badge in badges:
            strategy = cls.STRATEGY_MAPPING.get(badge.criteria["type"])
            if strategy and strategy.is_eligible(user, badge, **context):
                eligible_badges.append(badge)
        
        return eligible_badges

    @classmethod
    def award_badges(cls, user, activity_type=None):
        # Context'i activity_type ile birlikte ilet
        context = {"activity_type": activity_type} if activity_type else {}
        
        for badge in cls.get_eligible_badges(user, **context):
            UserBadge.objects.get_or_create(user=user, badge=badge)