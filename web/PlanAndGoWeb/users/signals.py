# users/signals.py
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile, Activity  # Activity modelini ekledik

# Profil oluşturma ve kaydetme (mevcut kod)
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

# Yeni eklenen: Profil güncelleme aktivitesini kaydet
@receiver(post_save, sender=Profile)
def track_profile_update(sender, instance, **kwargs):
    # Her profil güncellemede aktivite oluştur
    Activity.objects.create(
        user=instance.user,
        activity_type='profile_update',
        metadata={"details": "Profil bilgileri güncellendi"}
    )

    # İlk güncelleme kontrolü için ekstra mantık
    if not hasattr(instance, '_first_update_checked'):
        activity_count = Activity.objects.filter(
            user=instance.user,
            activity_type='profile_update'
        ).count()
        
        # İlk güncelleme ise özel işlem yap
        if activity_count == 1:
            instance.user.profile.first_update = True  # Örnek bir alan
            instance.user.profile.save()
            setattr(instance, '_first_update_checked', True)  # Tekrarlı çağrıları önle