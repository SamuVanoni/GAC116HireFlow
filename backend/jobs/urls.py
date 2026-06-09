from django.urls import path
from .views import JobListAPIView

urlpatterns = [
    path('vagas/', JobListAPIView.as_view(), name='api-job-list'),
]