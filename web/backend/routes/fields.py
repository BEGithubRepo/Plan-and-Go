# # routes/fields.py

# from django.db import models
# from django.contrib.gis.geos import GEOSGeometry
# from django.core.exceptions import ValidationError

# class WKTGeometryField(models.TextField):
#     """Coğrafi verileri WKT formatında saklayan özel alan."""
    
#     def from_db_value(self, value, expression, connection):
#         if value is None:
#             return value
#         return GEOSGeometry(value)  # WKT → GEOSGeometry
    
#     def to_python(self, value):
#         if isinstance(value, GEOSGeometry):
#             return value
#         if value is None:
#             return value
#         try:
#             return GEOSGeometry(value)  # String → GEOSGeometry
#         except (ValueError, TypeError):
#             raise ValidationError("Geçersiz geometri formatı")
    
#     def get_prep_value(self, value):
#         if value is None:
#             return value
#         return str(value.wkt)  # GEOSGeometry → WKT

# routes/fields.py

from django.db import models
from django.contrib.gis.geos import GEOSGeometry
from django.core.exceptions import ValidationError

class WKTGeometryField(models.TextField):
    """Coğrafi verileri WKT formatında saklayan özel alan."""
    
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return GEOSGeometry(value)  # WKT → GEOSGeometry
    
    def to_python(self, value):
        if isinstance(value, GEOSGeometry):
            return value
        if value is None:
            return value
        try:
            return GEOSGeometry(value)  # String → GEOSGeometry
        except (ValueError, TypeError):
            raise ValidationError("Geçersiz geometri formatı")
    
    def get_prep_value(self, value):
        if value is None:
            return value
        
        # Eğer zaten string ise (WKT) direkt döndür
        if isinstance(value, str):
            return value
        
        # GEOSGeometry ise WKT'ye çevir
        return str(value.wkt)