# badges/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User, Profile
from badges.models import Badge, UserBadge
from badges.services import BadgeAwardService
from django.apps import apps

Activity = apps.get_model('users', 'Activity')

@receiver(post_save, sender=Activity)
def handle_activity_based_badges(sender, instance, **kwargs):
    # Eğer bu aktivite bir rozet kontrolü sırasında oluşturulduysa yoksay
    if getattr(instance, '_from_badge_check', False):
        return
    
    # Rozet kontrolü yaparken yeni aktivite oluşumunu engelle
    instance._from_badge_check = True
    try:
        BadgeAwardService.award_badges(
            user=instance.user,
            activity_type=instance.activity_type
        )
    finally:
        del instance._from_badge_check

@receiver(post_save, sender=User)
def handle_event_based_badges(sender, instance, created, **kwargs):
    if created:
        BadgeAwardService.award_badges(user=instance)