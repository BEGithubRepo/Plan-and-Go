# routes/apps.py

from django.apps import AppConfig

class RoutesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'routes'
    verbose_name = 'Rota Yönetim Sistemi'

    def ready(self):
        # Sinyalleri import et
        import routes.signals