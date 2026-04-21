from django.contrib import admin
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    """Admin interface for Announcement model"""
    list_display = ['title', 'published_date', 'created_by', 'is_active']
    list_filter = ['is_active', 'published_date']
    search_fields = ['title', 'content']
    readonly_fields = ['published_date']
    date_hierarchy = 'published_date'
    ordering = ['-published_date']
