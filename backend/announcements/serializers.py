from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for Announcement model"""
    created_by = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'published_date', 'created_by', 'is_active']
        read_only_fields = ['id', 'published_date', 'created_by']
    
    def get_created_by(self, obj):
        """Return creator information"""
        if obj.created_by:
            return {
                'id': obj.created_by.id,
                'name': obj.created_by.name
            }
        return None
