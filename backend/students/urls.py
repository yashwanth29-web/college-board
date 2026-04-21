from django.urls import path
from .views import StudentListView, StudentDetailView, StudentDeactivateView

app_name = 'students'

urlpatterns = [
    path('', StudentListView.as_view(), name='student-list'),
    path('<int:id>', StudentDetailView.as_view(), name='student-detail'),
    path('<int:id>/deactivate', StudentDeactivateView.as_view(), name='student-deactivate'),
]
