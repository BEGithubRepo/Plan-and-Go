# users/models.py

from django.db import models
from model_utils.models import TimeStampedModel
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from PIL import Image
from io import BytesIO
from django.core.files import File
import uuid
from django.conf import settings
from django.utils import timezone

# Custom User Model
class User(AbstractUser):
    MOBILE_MAX_LENGTH = 15
    
    email = models.EmailField(_('email address'), unique=True)
    mobile = models.CharField(
        _('mobile number'), 
        max_length=MOBILE_MAX_LENGTH, 
        blank=True, 
        null=True,
        help_text=_('Format: +905551234567')
    )
    is_mobile_verified = models.BooleanField(default=False)
    verification_uuid = models.UUIDField(_('Unique Verification UUID'), default=uuid.uuid4)

    class Meta:
        swappable = 'AUTH_USER_MODEL'

class Profile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='profile'
    )

    avatar = models.ImageField(
        _('profile picture'), 
        default='default.jpg', 
        upload_to='profile_images/'
    )

    bio = models.TextField(_('about me'), blank=True)
    social_media = models.JSONField(
        _('social media links'),
        default=dict,
        blank=True,
        help_text=_('JSON format: {"platform": "url"}')
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def save(self, *args, **kwargs):
        # Eğer avatar işleniyorsa, tekrar save tetikleme
        if not hasattr(self, '_processing_avatar'):
            self._processing_avatar = True
            super().save(*args, **kwargs)  # İlk kayıt

            if self.avatar:
                img = Image.open(self.avatar.path)
                img.thumbnail((150, 150), Image.Resampling.LANCZOS)
                
                output = BytesIO()
                img.save(output, format='WEBP', quality=85)
                output.seek(0)
                
                # Avatarı güncelle (save=False ile tekrar sinyal tetikleme)
                self.avatar.save(
                    f"{self.user.username}_avatar.webp",
                    File(output),
                    save=False  # <-- save=False yapıldı
                )
            del self._processing_avatar
        else:
            super().save(*args, **kwargs)

class Activity(models.Model):
    class ActivityType(models.TextChoices):
        TRAVEL = 'travel', _('Travel Added')
        COMMENT = 'comment', _('Comment Made')
        LIKE = 'like', _('Content Liked')
        PROFILE_UPDATE = 'profile_update', _('Profile Updated')
        PASSWORD_CHANGE = 'password_change', _('Password Changed')

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='activities'
    )
    activity_type = models.CharField(
        _('activity type'),
        max_length=20,
        choices=ActivityType.choices
    )
    timestamp = models.DateTimeField(_('occurred at'), auto_now_add=True)
    metadata = models.JSONField(
        _('additional data'),
        default=dict,
        blank=True,
        help_text=_('Device info, location data etc.')
    )
    ip_address = models.GenericIPAddressField(
        _('IP address'),
        blank=True,
        null=True
    )

    class Meta:
        verbose_name_plural = _('Activities')
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user}: {self.get_activity_type_display()}"

class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now() + timezone.timedelta(hours=1))  # 1 saat geçerli
    is_used = models.BooleanField(default=False)