"""
Custom throttle classes for authentication endpoints
"""
from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """
    Limit login attempts to prevent brute force attacks
    Rate: 5 attempts per minute per IP address
    """
    scope = 'login'
    
    def get_cache_key(self, request, view):
        """Throttle by IP address"""
        ident = self.get_ident(request)
        return f'throttle_login_{ident}'
