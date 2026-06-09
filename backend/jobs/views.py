from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Job
from .serializers import JobSerializer

class JobListAPIView(generics.ListAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_with_meta = JobSerializer
    serializer_class = JobSerializer
    # Permite que candidatos vejam as vagas mesmo sem estar logados ainda
    permission_classes = [AllowAny]
