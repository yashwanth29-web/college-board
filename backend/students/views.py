from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from authentication.models import Student
from authentication.permissions import IsAdminUser
from .serializers import StudentSerializer, StudentUpdateSerializer


class StudentPagination(PageNumberPagination):
    """Custom pagination for student list"""
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


class StudentListView(APIView):
    """
    GET /api/students
    Get paginated list of students with search functionality (Admin only)
    """
    permission_classes = [IsAdminUser]
    pagination_class = StudentPagination
    
    def get(self, request):
        # Get search query parameter
        search = request.query_params.get('search', '').strip()
        
        # Base queryset with select_related for optimization
        queryset = Student.objects.select_related('user').all()
        
        # Apply search filter if provided
        if search:
            queryset = queryset.filter(
                Q(user__name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(student_id__icontains=search)
            )
        
        # Order by enrollment date (newest first)
        queryset = queryset.order_by('-enrollment_date')
        
        # Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        # Serialize data
        serializer = StudentSerializer(paginated_queryset, many=True)
        
        # Return paginated response
        return Response(
            {
                'status': 'success',
                'data': {
                    'count': paginator.page.paginator.count,
                    'next': paginator.get_next_link(),
                    'previous': paginator.get_previous_link(),
                    'results': serializer.data
                }
            },
            status=status.HTTP_200_OK
        )


class StudentDetailView(APIView):
    """
    PATCH /api/students/{id}
    Update student profile information (Admin only)
    """
    permission_classes = [IsAdminUser]
    
    def patch(self, request, id):
        try:
            student = Student.objects.select_related('user').get(id=id)
        except Student.DoesNotExist:
            return Response(
                {
                    'status': 'error',
                    'message': 'Student not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate and update student data
        serializer = StudentUpdateSerializer(student, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Return full student data
            full_serializer = StudentSerializer(student)
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Student updated successfully',
                    'data': full_serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'status': 'error',
                'message': 'Validation failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class StudentDeactivateView(APIView):
    """
    PATCH /api/students/{id}/deactivate
    Deactivate a student account (Admin only)
    """
    permission_classes = [IsAdminUser]
    
    def patch(self, request, id):
        try:
            student = Student.objects.select_related('user').get(id=id)
        except Student.DoesNotExist:
            return Response(
                {
                    'status': 'error',
                    'message': 'Student not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already deactivated
        if not student.user.is_active:
            return Response(
                {
                    'status': 'error',
                    'message': 'Student account is already deactivated'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Deactivate user account
        student.user.is_active = False
        student.user.save()
        
        return Response(
            {
                'status': 'success',
                'message': 'Student account deactivated'
            },
            status=status.HTTP_200_OK
        )
