from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Media


def validate_file_size(file):
    """Limit file size to 50MB"""
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    if file.size > max_size:
        raise ValidationError('File size cannot exceed 50MB')


def validate_file_type(file):
    """Validate file is video or image"""
    allowed_types = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png']
    if file.content_type not in allowed_types:
        raise ValidationError(
            f'File type not allowed. Allowed types: {", ".join(allowed_types)}'
        )


class MediaSerializer(serializers.ModelSerializer):
    """Serializer for Media model with file URL generation"""
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    file = serializers.FileField(
        validators=[validate_file_size, validate_file_type],
        write_only=True
    )
    
    class Meta:
        model = Media
        fields = [
            'id', 'title', 'description', 'file', 'file_url', 'file_type',
            'file_size', 'thumbnail', 'thumbnail_url', 'created_by',
            'created_by_name', 'created_at', 'is_active', 'views'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'file_size', 'views', 'is_active']
    
    def get_file_url(self, obj):
        """Generate full URL for the media file"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_thumbnail_url(self, obj):
        """Generate full URL for the thumbnail"""
        request = self.context.get('request')
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None
    
    def create(self, validated_data):
        """Create media instance with file size"""
        file = validated_data.get('file')
        if file:
            validated_data['file_size'] = file.size
        return super().create(validated_data)


class MediaListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing media"""
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = Media
        fields = [
            'id', 'title', 'description', 'file_url', 'file_type',
            'thumbnail_url', 'created_by_name', 'created_at', 'views'
        ]
    
    def get_file_url(self, obj):
        """Generate full URL for the media file"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_thumbnail_url(self, obj):
        """Generate full URL for the thumbnail"""
        request = self.context.get('request')
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None
