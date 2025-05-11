from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification, Comment
from .mqtt import publish_notification

@receiver(post_save, sender=Notification)
def send_mqtt_notification(sender, instance, created, **kwargs):
    if created:
        publish_notification(instance.user.id, instance.message)

# @receiver(post_save, sender=Comment)
# def 