# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, Activity, PasswordResetToken
from django.utils.html import format_html

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile Details'
    fields = ('avatar_preview', 'bio', 'social_media')
    readonly_fields = ('avatar_preview',)
    fk_name = 'user'

    def avatar_preview(self, instance):
        if instance.avatar:
            return format_html('<img src="{}" style="max-height: 100px;"/>', instance.avatar.url)
        return "-"
    avatar_preview.short_description = 'Avatar Preview'

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'mobile', 'is_mobile_verified', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_mobile_verified')
    search_fields = ('username', 'email', 'mobile')
    ordering = ('-date_joined',)
    inlines = [ProfileInline]
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'mobile', 'first_name', 'last_name')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_mobile_verified'),
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'mobile', 'password1', 'password2'),
        }),
    )

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'truncated_bio')
    search_fields = ('user__username', 'bio')
    
    def truncated_bio(self, obj):
        return obj.bio[:50] + '...' if len(obj.bio) > 50 else obj.bio
    truncated_bio.short_description = 'Bio'

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'formatted_timestamp', 'ip_address')
    list_filter = ('activity_type',)
    search_fields = ('user__username', 'metadata')
    date_hierarchy = 'timestamp'
    readonly_fields = ('metadata_prettified',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'activity_type', 'ip_address')
        }),
        ('Metadata', {
            'fields': ('metadata_prettified',),
            'classes': ('collapse',)
        }),
    )

    def formatted_timestamp(self, obj):
        return obj.timestamp.strftime("%Y-%m-%d %H:%M")
    formatted_timestamp.admin_order_field = 'timestamp'
    formatted_timestamp.short_description = 'Timestamp'

    def metadata_prettified(self, obj):
        return format_html("<pre>{}</pre>", str(obj.metadata))
    metadata_prettified.short_description = 'Formatted Metadata'

admin.site.register(PasswordResetToken)