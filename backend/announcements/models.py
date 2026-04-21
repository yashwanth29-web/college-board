from django.db import models
from authentication.models import User


class Announcement(models.Model):
    """Announcements posted by administrators"""
    title = models.CharField(max_length=255)
    content = models.TextField()
    published_date = models.DateTimeField(auto_now_add=True, db_index=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='announcements'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'announcements'
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['-published_date']),
            models.Index(fields=['is_active', '-published_date']),
        ]
    
    def __str__(self):
        return self.title
