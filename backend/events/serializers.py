from rest_framework import serializers
from .models import Event, EventRegistration
from authentication.models import User


class EventCreatorSerializer(serializers.ModelSerializer):
    """Serializer for event creator information"""
    class Meta:
        model = User
        fields = ['id', 'name']


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    created_by = EventCreatorSerializer(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'date', 'time', 'location',
            'capacity', 'current_registrations', 'is_full', 'is_active',
            'created_by', 'created_at'
        ]
        read_only_fields = ['id', 'current_registrations', 'created_at', 'created_by']
    
    def create(self, validated_data):
        # Set created_by to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for EventRegistration model"""
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'student', 'event', 'registered_at',
            'student_name', 'student_id', 'student_email', 'event_title'
        ]
        read_only_fields = ['id', 'registered_at']
