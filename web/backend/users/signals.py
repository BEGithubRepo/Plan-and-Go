from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import User, Profile, Activity

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(pre_save, sender=Profile)
def track_profile_changes(sender, instance, **kwargs):
    if not instance.pk:  # Yeni profil oluşturuluyorsa
        return
    try:
        old_profile = Profile.objects.get(pk=instance.pk)
        instance._old_avatar = old_profile.avatar
        instance._old_bio = old_profile.bio
        instance._old_social_media = old_profile.social_media
    except Profile.DoesNotExist:
        pass

@receiver(post_save, sender=Profile)
def create_profile_activity(sender, instance, created, **kwargs):
    if created:
        return  # Yeni profil için aktivite oluşturma
    
    changed_fields = []
    if hasattr(instance, '_old_avatar') and instance.avatar != instance._old_avatar:
        changed_fields.append('avatar')
    if hasattr(instance, '_old_bio') and instance.bio != instance._old_bio:
        changed_fields.append('bio')
    if hasattr(instance, '_old_social_media') and instance.social_media != instance._old_social_media:
        changed_fields.append('social_media')
    
    if changed_fields:
        Activity.objects.create(
            user=instance.user,
            activity_type="profile_update",
            metadata={"changed_fields": changed_fields}
        )