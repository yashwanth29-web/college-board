from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model - used for responses"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_student', 'is_staff', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegistrationSerializer(serializers.Serializer):
    """Serializer for student registration"""
    name = serializers.CharField(
        max_length=255,
        required=True,
        trim_whitespace=True
    )
    email = serializers.EmailField(
        validators=[EmailValidator()],
        required=True
    )
    password = serializers.CharField(
        min_length=8,
        max_length=128,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    student_id = serializers.CharField(
        max_length=50,
        required=True
    )
    
    def validate_email(self, value):
        """Ensure email is unique and normalized"""
        email = value.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return email
    
    def validate_password(self, value):
        """Validate password strength using Django validators"""
        validate_password(value)
        return value
    
    def validate_student_id(self, value):
        """Ensure student_id is unique"""
        # Import here to avoid circular import
        from django.apps import apps
        Student = apps.get_model('authentication', 'Student')
        
        if Student.objects.filter(student_id=value).exists():
            raise serializers.ValidationError("Student with this ID already exists.")
        return value
    
    def create(self, validated_data):
        """Create user and student profile"""
        # Import here to avoid circular import
        from django.apps import apps
        Student = apps.get_model('authentication', 'Student')
        
        student_id = validated_data.pop('student_id')
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            is_student=True
        )
        
        # Create student profile
        Student.objects.create(
            user=user,
            student_id=student_id
        )
        
        return user
