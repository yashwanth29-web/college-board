from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'category', 'status', 'student', 'assigned_to', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['subject', 'description', 'student__user__name', 'student__student_id']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Ticket Information', {
            'fields': ('subject', 'description', 'category')
        }),
        ('Status & Assignment', {
            'fields': ('status', 'student', 'assigned_to', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
