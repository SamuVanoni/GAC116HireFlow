from django.urls import path
from .views import CompanyListCreateAPIView, JobDetailAPIView, JobListAPIView, RecruiterJobListCreateAPIView

urlpatterns = [
    path('vagas/', JobListAPIView.as_view(), name='api-job-list'),
    path('vagas/<int:pk>/', JobDetailAPIView.as_view(), name='api-job-detail'),
    path('minhas-empresas/', CompanyListCreateAPIView.as_view(), name='api-company-list-create'),
    path('minhas-vagas/', RecruiterJobListCreateAPIView.as_view(), name='api-recruiter-job-list-create'),
]
