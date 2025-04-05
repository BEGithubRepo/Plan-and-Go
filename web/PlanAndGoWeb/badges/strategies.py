# badges/strategies.py
from abc import ABC, abstractmethod
from django.db.models import Q

class BadgeCriteriaStrategy(ABC):
    @abstractmethod
    def is_eligible(self, user, badge, **kwargs) -> bool:  # **kwargs eklendi
        pass

class ActivityCountStrategy(BadgeCriteriaStrategy):
    def is_eligible(self, user, badge, **kwargs) -> bool:  # **kwargs eklendi
        required_activity = badge.criteria.get("activity_type")
        required_count = badge.criteria.get("count", 0)
        return (
            user.activities.filter(activity_type=required_activity).count() 
            >= required_count
        )

class EventBasedStrategy(BadgeCriteriaStrategy):
    def is_eligible(self, user, badge, **kwargs) -> bool:  # **kwargs eklendi
        event_type = badge.criteria.get("event")
        if event_type == "user_created":
            return True
        return False

class CompositeCriteriaStrategy(BadgeCriteriaStrategy):
    def __init__(self, strategies: list[BadgeCriteriaStrategy]):
        self.strategies = strategies

    def is_eligible(self, user, badge) -> bool:
        return all(
            strategy.is_eligible(user, badge) 
            for strategy in self.strategies
        )

class ProfileUpdateStrategy(BadgeCriteriaStrategy):
    def is_eligible(self, user, badge, **kwargs) -> bool:  # **kwargs eklendi
        required_count = badge.criteria.get("count", 2)
        return (
            user.activities.filter(activity_type="profile_update").count()
            == required_count
        )