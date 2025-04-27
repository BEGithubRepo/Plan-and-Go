# routes/signals.py

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Route
import qrcode
from io import BytesIO
from django.core.files import File
import uuid

@receiver(post_save, sender=Route)
def handle_route_changes(sender, instance, **kwargs):
    """Rota değişikliklerini loglama"""
    action = "oluşturuldu" if kwargs['created'] else "güncellendi"
    print(f"Rota {action}: {instance.title} (ID: {instance.id})")

@receiver(pre_save, sender=Route)
def handle_share_token(sender, instance, **kwargs):
    """Paylaşım durumu değişikliklerini yönetme"""
    # Eğer paylaşım tokenı yoksa veya değiştiyse
    if not instance.share_token:
        instance.share_token = uuid.uuid4()
    # if instance.is_shared:
        
    # else:
    #     instance.share_token = None

    # Orijinal değeri kaydet
    if not kwargs['raw']:
        try:
            original = Route.objects.get(pk=instance.pk)
            instance._original_share_token = original.share_token
        except Route.DoesNotExist:
            instance._original_share_token = None

@receiver(post_save, sender=Route)
def manage_qr_code(sender, instance, **kwargs):
    """QR kod yönetimi için"""
    qr_needs_update = False
    
    # QR kod oluşturma/update koşulları
    if kwargs['created']:
        qr_needs_update = True
    else:
        original = Route.objects.get(pk=instance.pk)
        if instance.share_token != original.share_token:
            qr_needs_update = True

    if qr_needs_update and instance.share_token:
        # QR kod oluştur
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(instance.share_link)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="#2ecc71", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        # Mevcut QR kodunu sil ve yenisini kaydet
        if instance.qr_code:
            instance.qr_code.delete(save=False)
            
        instance.qr_code.save(
            f'qr_{instance.share_token}.png',
            File(buffer),
            save=False
        )
        
        # Sonsuz döngüyü önlemek için partial update
        Route.objects.filter(pk=instance.pk).update(qr_code=instance.qr_code)