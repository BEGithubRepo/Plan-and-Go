# badges/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(models.Model):
    BADGE_TYPES = [
        ('travel', 'Seyahat Rozeti'),
        ('social', 'Sosyal Rozet'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/')
    criteria = models.JSONField()

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'badge')  # Aynı rozet tekrar verilemez