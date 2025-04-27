# routes/models.py

from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from .fields import WKTGeometryField
import uuid

User = get_user_model()

class Route(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routes')
    title = models.CharField(max_length=255)
    start_point = WKTGeometryField()  # Coğrafi veri için PointField
    destination = WKTGeometryField()  # Coğrafi veri için PointField
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_shared = models.BooleanField(default=False)
    share_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    collaborators = models.ManyToManyField(User, related_name='collaborated_routes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    version = models.PositiveIntegerField(default=0)  # Versiyon kontrol için

    def generate_qr_code(self):
        """QR kod oluşturma işlevselliğini modele taşıma"""
        import qrcode
        from io import BytesIO
        from django.core.files import File
        
        qr = qrcode.make(self.share_link)
        buffer = BytesIO()
        qr.save(buffer)
        self.qr_code.save(f'qr_{self.share_token}.png', File(buffer))

    @property
    def share_link(self):
        return reverse('shared-route-detail', kwargs={'share_token': self.share_token})

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    class Meta:
        indexes = [
            models.Index(fields=['share_token']),
            models.Index(fields=['is_shared']),
            models.Index(fields=['version']),  # Yeni indeks
        ]
        ordering = ['-created_at']

class Waypoint(models.Model):
    route = models.ForeignKey(Route, related_name='waypoints', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    location = WKTGeometryField()  # Coğrafi veri için PointField
    arrival_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.order}. {self.name} - {self.route.title}"

    class Meta:
        unique_together = ['route', 'order']
        ordering = ['order']