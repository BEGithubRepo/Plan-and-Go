# # routes/serializers.py

# from rest_framework import serializers
# from django.contrib.gis.geos import Point
# from .models import Route, Waypoint
# from users.models import User

# class WaypointSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Waypoint
#         fields = ['id', 'name', 'order', 'latitude', 'longitude', 'arrival_time']
#         read_only_fields = ('route',)

#     def validate(self, data):
#         """Koordinat validasyonu"""
#         try:
#             Point(data['longitude'], data['latitude'])
#         except (KeyError, TypeError, ValueError):
#             raise serializers.ValidationError("Geçersiz koordinat değerleri")
#         return data

# class RouteSerializer(serializers.ModelSerializer):
#     version = serializers.IntegerField(read_only=True)
#     collaborators = serializers.SlugRelatedField(
#         many=True,
#         slug_field='email',
#         queryset=User.objects.all(),
#         required=False
#     )
#     waypoints = WaypointSerializer(many=True, required=False)
#     qr_code = serializers.ImageField(read_only=True)
#     share_link = serializers.SerializerMethodField()

#     class Meta:
#         model = Route
#         fields = [
#             'id', 'title', 'start_point', 'destination', 
#             'start_date', 'end_date', 'is_shared', 'version',
#             'collaborators', 'waypoints', 'qr_code', 'share_link'
#         ]
#         read_only_fields = ('user', 'created_at', 'last_updated')

#     def get_share_link(self, obj):
#         return self.context['request'].build_absolute_uri(obj.share_link)

#     def validate(self, data):
#         """Tarih ve coğrafi veri validasyonu"""
#         errors = {}
        
#         if data.get('start_date') and data.get('end_date'):
#             if data['start_date'] > data['end_date']:
#                 errors['end_date'] = "Bitiş tarihi başlangıçtan önce olamaz"

#         for field in ['start_point', 'destination']:
#             if field in data and not self.is_valid_point(data[field]):
#                 errors[field] = "Geçersiz koordinat formatı"

#         if errors:
#             raise serializers.ValidationError(errors)
            
#         return data

#     @staticmethod
#     def is_valid_point(value):
#         """PointField validasyon metodu"""
#         try:
#             Point(value)
#             return True
#         except (TypeError, ValueError):
#             return False

from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from .models import Route, Waypoint
from users.models import User
from .fields import WKTGeometryField  # Özel alanı import edin

class WaypointSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True)
    longitude = serializers.FloatField(write_only=True)
    
    class Meta:
        model = Waypoint
        fields = ['id', 'name', 'order', 'latitude', 'longitude', 'arrival_time']
        read_only_fields = ('route',)

    def validate(self, data):
        """Koordinatları WKT'ye çevir ve modelle eşleştir"""
        lat = data.pop('latitude', None)  # Veriden çıkar
        lng = data.pop('longitude', None) # Veriden çıkar
        
        if not lat or not lng:
            raise serializers.ValidationError("Koordinatlar eksik")
        
        # WKT formatına çevir (POINT(longitude latitude))
        data['location'] = f"POINT({lng} {lat})"
        return data

    def to_representation(self, instance):
        """Response'ta WKT'yi latitude/longitude olarak göster"""
        representation = super().to_representation(instance)
        point = GEOSGeometry(instance.location)
        representation['latitude'] = point.y
        representation['longitude'] = point.x
        return representation

class RouteSerializer(serializers.ModelSerializer):
    start_point = WKTGeometryField()
    destination = WKTGeometryField()
    version = serializers.IntegerField(read_only=True)
    collaborators = serializers.SlugRelatedField(
        many=True,
        slug_field='email',
        queryset=User.objects.all(),
        required=False
    )
    waypoints = WaypointSerializer(many=True, required=False)  # read_only=False (default)
    qr_code = serializers.ImageField(read_only=True)
    share_link = serializers.SerializerMethodField()
    share_token = serializers.UUIDField(read_only=True)

    class Meta:
        model = Route
        fields = [
            'id', 'title', 'start_point', 'destination', 
            'start_date', 'end_date', 'is_shared', 'version',
            'collaborators', 'waypoints', 'qr_code', 'share_link', 'share_token'
        ]
        read_only_fields = ('user', 'created_at', 'last_updated')

    def get_share_link(self, obj):
        return self.context['request'].build_absolute_uri(obj.share_link)

    def create(self, validated_data):
        # Waypoint'leri ayrıştır
        waypoints_data = validated_data.pop('waypoints', [])
        
        # Route'u oluştur
        route = Route.objects.create(**validated_data)
        
        # Waypoint'leri ekle
        for wp_data in waypoints_data:
            Waypoint.objects.create(route=route, **wp_data)
        
        return route

    def update(self, instance, validated_data):
        waypoints_data = validated_data.pop('waypoints', [])
        
        # Route'u güncelle
        instance = super().update(instance, validated_data)
        
        # Waypoint'leri sil ve yeniden oluştur
        instance.waypoints.all().delete()
        for wp_data in waypoints_data:
            Waypoint.objects.create(route=instance, **wp_data)
        
        return instance
    
    def validate(self, data):
        """WKT ve tarih validasyonu"""
        errors = {}
        
        # Tarih kontrolü
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                errors['end_date'] = "Bitiş tarihi başlangıçtan önce olamaz"
        
        # WKT kontrolü
        for field in ['start_point', 'destination']:
            value = data.get(field)
            if value:
                try:
                    GEOSGeometry(value)  # WKT geçerliliğini doğrula
                except (GEOSException, ValueError):
                    errors[field] = "Geçersiz WKT formatı. Örnek: POINT(longitude latitude)"
        
        if errors:
            raise serializers.ValidationError(errors)
            
        return data