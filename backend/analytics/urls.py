from django.urls import path
from .views import (
    AnalyticsOverviewView,
    AnalyticsParticipationView,
    AnalyticsTicketsView
)

urlpatterns = [
    path('analytics/overview', AnalyticsOverviewView.as_view(), name='analytics-overview'),
    path('analytics/participation', AnalyticsParticipationView.as_view(), name='analytics-participation'),
    path('analytics/tickets', AnalyticsTicketsView.as_view(), name='analytics-tickets'),
]
