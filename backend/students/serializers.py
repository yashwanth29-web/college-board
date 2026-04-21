from rest_framework import serializers
from authentication.models import Student, User


class UserNestedSerializer(serializers.ModelSerializer):
    """Nested user serializer for student data"""
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'is_active']
        read_only_fields = ['id', 'name', 'email', 'is_active']


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model with nested user data"""
    user = UserNestedSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'student_id', 'enrollment_date', 'phone', 'department', 'year']
        read_only_fields = ['id', 'student_id', 'enrollment_date']


class StudentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating student profile information"""
    
    class Meta:
        model = Student
        fields = ['phone', 'department', 'year']
    
    def validate_year(self, value):
        """Validate year is between 1 and 4"""
        if value is not None and (value < 1 or value > 4):
            raise serializers.ValidationError("Year must be between 1 and 4")
        return value
