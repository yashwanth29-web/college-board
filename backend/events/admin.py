from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'time', 'location', 'capacity', 'current_registrations', 'is_active']
    list_filter = ['is_active', 'date']
    search_fields = ['title', 'location']
    ordering = ['date', 'time']


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'event', 'registered_at']
    list_filter = ['registered_at']
    search_fields = ['student__user__name', 'event__title']
    ordering = ['-registered_at']
