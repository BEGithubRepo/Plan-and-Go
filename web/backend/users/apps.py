# users/apps.py

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
    verbose_name = _('Kullanıcı Yönetimi')

    def ready(self):
        # Sinyalleri kaydetmek için
        import users.signals
        