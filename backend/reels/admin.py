from django.contrib import admin
from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ['title', 'file_type', 'created_by', 'created_at', 'is_active', 'views']
    list_filter = ['file_type', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'file_size', 'views']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Media Information', {
            'fields': ('title', 'description', 'file', 'file_type', 'thumbnail')
        }),
        ('Metadata', {
            'fields': ('file_size', 'views', 'is_active', 'created_by', 'created_at')
        }),
    )
