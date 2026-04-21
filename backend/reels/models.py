from django.db import models
from authentication.models import User


class Media(models.Model):
    """Media files for reel-style feed"""
    FILE_TYPE_CHOICES = [
        ('video', 'Video'),
        ('image', 'Image'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='reels/%Y/%m/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_size = models.IntegerField()  # in bytes
    thumbnail = models.ImageField(upload_to='thumbnails/%Y/%m/', null=True, blank=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='media_uploads'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_active = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'media'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active', '-created_at']),
        ]
    
    def __str__(self):
        return self.title
