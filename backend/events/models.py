from django.db import models
from authentication.models import User, Student


class Event(models.Model):
    """College events that students can register for"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField(db_index=True)
    time = models.TimeField(db_index=True)
    location = models.CharField(max_length=255)
    capacity = models.IntegerField()
    current_registrations = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_events'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['date', 'time']
        indexes = [
            models.Index(fields=['date', 'time']),
            models.Index(fields=['is_active', 'date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.date}"
    
    @property
    def is_full(self):
        return self.current_registrations >= self.capacity


class EventRegistration(models.Model):
    """Many-to-many relationship between students and events"""
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='event_registrations'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_registrations'
        unique_together = ['student', 'event']
        indexes = [
            models.Index(fields=['student', 'event']),
            models.Index(fields=['event', 'registered_at']),
        ]
    
    def __str__(self):
        return f"{self.student.user.name} -> {self.event.title}"
