# badges/models.py

from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(TimeStampedModel):
    name = models.CharField(_('badge name'), max_length=100)
    description = models.TextField(_('description'), blank=True)
    image = models.ImageField(_('badge image'), upload_to='badges/')
    criteria = models.JSONField(
        _('awarding criteria'),
        default=dict,
        help_text=_('JSON format: {"condition": "value"}')
    )

    def __str__(self):
        return self.name

class UserBadge(TimeStampedModel):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='user_badges'
    )
    badge = models.ForeignKey(
        Badge, 
        on_delete=models.CASCADE, 
        related_name='badge_owners'
    )
    earned_at = models.DateTimeField(_('earned at'), auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

class BadgeTrade(TimeStampedModel):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    STATUS_CHOICES = [
        (PENDING, _('Pending')),
        (ACCEPTED, _('Accepted')),
        (REJECTED, _('Rejected')),
    ]

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_trades',
        verbose_name=_('sender')
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_trades',
        verbose_name=_('receiver')
    )
    badges = models.ManyToManyField(
        Badge,
        through='TradeBadge',
        verbose_name=_('badges')
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    message = models.TextField(_('message'), blank=True)

    def __str__(self):
        return f"{self.sender} → {self.receiver} ({self.status})"

class TradeBadge(models.Model):
    trade = models.ForeignKey(BadgeTrade, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)