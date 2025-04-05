# badges/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import Activity, User, Profile
from badges.models import Badge, UserBadge
from badges.services import BadgeAwardService

@receiver(post_save, sender=Activity)
def handle_activity_based_badges(sender, instance, **kwargs):
    BadgeAwardService.award_badges(
        user=instance.user,
        activity_type=instance.activity_type
    )

@receiver(post_save, sender=User)
def handle_event_based_badges(sender, instance, created, **kwargs):
    if created:
        BadgeAwardService.award_badges(user=instance)

@receiver(post_save, sender=Profile)
def track_profile_update(sender, instance, **kwargs):
    Activity.objects.create(
        user=instance.user,
        activity_type="profile_update"
    )