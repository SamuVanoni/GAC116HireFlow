from django.urls import path
from .views import ApplicationCreateAPIView, JobRankingAPIView, MyApplicationListAPIView, MyResumeListAPIView, ResumeUploadAPIView

urlpatterns = [
    path('upload-curriculo/', ResumeUploadAPIView.as_view(), name='api-resume-upload'),
    path('meus-curriculos/', MyResumeListAPIView.as_view(), name='api-resume-list'),
    path('candidatar/', ApplicationCreateAPIView.as_view(), name='api-application-create'),
    path('minhas-candidaturas/', MyApplicationListAPIView.as_view(), name='api-application-list'),
    path('ranking/<int:job_id>/', JobRankingAPIView.as_view(), name='api-job-ranking'),
]
