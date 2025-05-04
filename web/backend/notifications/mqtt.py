import paho.mqtt.client as mqtt
from django.conf import settings

def publish_notification(user_id, message):
    client = mqtt.Client()
    client.connect(settings.MQTT_BROKER['HOST'], settings.MQTT_BROKER['PORT'])
    client.publish(f"user/{user_id}/notifications", message)
    client.disconnect()