from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsStudentUser(permissions.BasePermission):
    """Allow access only to student users"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_student


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access to object owner or admin"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_staff:
            return True
        
        # Check if object has a student attribute
        if hasattr(obj, 'student'):
            return obj.student.user == request.user
        
        # Check if object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
