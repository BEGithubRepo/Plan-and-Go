# users/signals/activity_signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import Profile, Activity

@receiver(post_save, sender=Profile)
def handle_profile_activity(sender, instance, created, **kwargs):
    """Profil değişikliklerini aktivite kaydına ekle"""
    if not created:  # Sadece güncellemeleri takip et
        Activity.objects.create(
            user=instance.user,
            activity_type='profile_update',
            metadata={
                "changed_fields": list(instance.tracker.changed().keys()),
                "avatar_updated": 'avatar' in instance.tracker.changed()
            }
        )
        
        # İlk güncelleme kontrolü
        if instance.tracker.previous('avatar') is None:
            instance.user.profile.first_update = True
            instance.user.profile.save(update_fields=['first_update'])