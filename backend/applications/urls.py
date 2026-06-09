from django.urls import path
from .views import ResumeUploadAPIView

urlpatterns = [
    path('upload-curriculo/', ResumeUploadAPIView.as_view(), name='api-resume-upload'),
]