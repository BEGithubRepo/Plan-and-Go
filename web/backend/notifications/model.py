from django.db import models
from users.models import User
from routes.models import Route

class Notification(models.Model):
    CATEGORY_CHOICES = [
        ('route_update', 'Rota Güncellemesi'),
        ('reminder', 'Hatırlatıcı'),
        ('premium', 'Premium Teklif'),
        ('badge', 'Yeni Rozet'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, null=True, blank=True)
    travel_buddy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='buddy_feedbacks')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)