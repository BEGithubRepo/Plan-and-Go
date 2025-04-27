# routes/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import Route, Waypoint

class WaypointInline(admin.TabularInline):
    model = Waypoint
    extra = 1
    fields = ('name', 'order', 'latitude', 'longitude', 'arrival_time')
    ordering = ('order',)

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'share_token_short', 'is_shared', 'created_at', 'qr_code_preview')
    list_filter = ('is_shared', 'user', 'created_at')
    search_fields = ('title', 'start_point', 'destination', 'share_token')
    filter_horizontal = ('collaborators',)
    readonly_fields = ('share_token', 'qr_code_preview')
    inlines = [WaypointInline]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'share_token', 'qr_code_preview')
        }),
        ('Route Details', {
            'fields': ('start_point', 'destination', 'start_date', 'end_date')
        }),
        ('Permissions', {
            'fields': ('is_shared', 'collaborators')
        }),
    )

    def share_token_short(self, obj):
        return obj.share_token[:8] + '...' if obj.share_token else '-'
    share_token_short.short_description = 'Share Token'

    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.qr_code.url)
        return '-'
    qr_code_preview.short_description = 'QR Code Preview'