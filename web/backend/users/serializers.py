# users/serializers.py

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Profile, Activity
import re

class PasswordResetRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()

    def validate(self, data):
        user = User.objects.filter(username=data['username'], email=data['email']).first()
        if not user:
            raise serializers.ValidationError("Kullanıcı bulunamadı.")
        return data

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Şifreler eşleşmiyor.")
        return data

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    mobile = serializers.CharField(
        max_length=15,
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
        help_text="Format: +905551234567"
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        min_length=8
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'mobile', 'password', 'is_mobile_verified')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_mobile_verified': {'read_only': True}
        }

    def validate_mobile(self, value):
        if not re.match(r'^\+\d{11,14}$', value):
            raise serializers.ValidationError("Geçersiz telefon formatı. Örnek: +905551234567")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            mobile=validated_data['mobile'],
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = ('user', 'avatar_url', 'bio', 'social_media')
        extra_kwargs = {
            'social_media': {'write_only': True}
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None

class ActivitySerializer(serializers.ModelSerializer):
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    formatted_timestamp = serializers.DateTimeField(source='timestamp', format="%Y-%m-%d %H:%M")

    class Meta:
        model = Activity
        fields = ('user', 'activity_type', 'activity_type_display', 'formatted_timestamp', 'ip_address')

class CustomTokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer(read_only=True)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Özel claim'ler ekleyebilirsiniz (örneğin: token['is_admin'] = user.is_staff)
        return token