from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from authentication.permissions import IsAdminUser
from .models import Media
from .serializers import MediaSerializer, MediaListSerializer
from .pagination import ReelsPagination


class MediaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Media CRUD operations
    - GET /api/reels - List all media (paginated)
    - POST /api/reels - Upload media (admin only)
    - DELETE /api/reels/{id} - Delete media (admin only, soft delete)
    """
    queryset = Media.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = ReelsPagination
    
    def get_serializer_class(self):
        """Use different serializers for list and create"""
        if self.request.method == 'POST':
            return MediaSerializer
        return MediaListSerializer
    
    def get_queryset(self):
        """Return active media ordered by creation date descending"""
        return Media.objects.filter(is_active=True).order_by('-created_at')
    
    def get_permissions(self):
        """Admin permission required for POST and DELETE, authenticated for GET"""
        if self.request.method in ['POST', 'DELETE', 'PUT', 'PATCH']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """Override to provide custom response format"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response = self.get_paginated_response(serializer.data)
            return Response({
                'status': 'success',
                'data': paginated_response.data
            })
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Override to set created_by and provide custom response"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set the created_by field to current user
        serializer.save(created_by=request.user)
        
        return Response({
            'status': 'success',
            'message': 'Media uploaded successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete by setting is_active to False"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
