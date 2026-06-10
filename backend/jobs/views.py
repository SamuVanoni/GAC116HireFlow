from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Company, Job
from .serializers import CompanySerializer, JobCreateSerializer, JobSerializer

class JobListAPIView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Job.objects.select_related('company').all().order_by('-created_at')


class JobDetailAPIView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Job.objects.select_related('company').all()


class CompanyListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(recruiter=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)


class RecruiterJobListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.select_related('company').filter(
            company__recruiter=self.request.user,
        ).order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
