# badges/services.py
from .models import Badge, UserBadge
from .strategies import (
    ActivityCountStrategy,
    EventBasedStrategy,
    CompositeCriteriaStrategy,
    ProfileUpdateStrategy
)

class BadgeAwardService:
    STRATEGY_MAPPING = {
        "activity_based": ActivityCountStrategy(),
        "event_based": EventBasedStrategy(),
        "profile_update": ProfileUpdateStrategy()
    }

    @classmethod
    def get_eligible_badges(cls, user, **context):
        eligible_badges = []
        for badge in Badge.objects.all():
            strategy_type = badge.criteria.get("type")
            strategy = cls.STRATEGY_MAPPING.get(strategy_type)
            if strategy and strategy.is_eligible(user, badge, **context):
                eligible_badges.append(badge)
        return eligible_badges

    @classmethod
    def award_badges(cls, user, activity_type=None):
        for badge in cls.get_eligible_badges(user, activity_type = activity_type):
            UserBadge.objects.get_or_create(user=user, badge=badge)