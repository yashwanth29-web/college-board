from rest_framework import serializers
from .models import Ticket
from authentication.models import User, Student


class StudentInfoSerializer(serializers.ModelSerializer):
    """Serializer for student information in tickets"""
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'student_id', 'email']


class AssigneeInfoSerializer(serializers.ModelSerializer):
    """Serializer for assignee information in tickets"""
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for Ticket model"""
    student = StudentInfoSerializer(read_only=True)
    assigned_to = AssigneeInfoSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'subject', 'description', 'category', 'status',
            'student', 'assigned_to', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at']


class TicketCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating tickets (student only)"""
    class Meta:
        model = Ticket
        fields = ['subject', 'description', 'category']
    
    def create(self, validated_data):
        # Set student to the current user's student profile
        request = self.context['request']
        validated_data['student'] = request.user.student_profile
        return super().create(validated_data)


class TicketUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating tickets (admin only)"""
    class Meta:
        model = Ticket
        fields = ['status', 'assigned_to', 'resolved_at']
    
    def validate(self, data):
        # Auto-set resolved_at when status changes to resolved
        if data.get('status') == 'resolved' and not data.get('resolved_at'):
            from django.utils import timezone
            data['resolved_at'] = timezone.now()
        return data
