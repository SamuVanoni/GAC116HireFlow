from django.shortcuts import get_object_or_404
from jobs.models import Job
from pypdf import PdfReader
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Application, Resume
from .serializers import ApplicationCreateSerializer, ApplicationSerializer, ResumeSerializer


class ResumeUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ResumeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = request.FILES.get('pdf_file')
        if not pdf_file:
            return Response({"error": "Nenhum arquivo enviado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reader = PdfReader(pdf_file)
            extracted_text = ""

            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

            resume = serializer.save(
                candidate=request.user,
                extracted_text=extracted_text,
            )
            updated_applications = []
            for application in Application.objects.filter(candidate=request.user):
                application.save()
                updated_applications.append(application.id)

            return Response(
                {
                    "message": "Curriculo processado com sucesso.",
                    "id": resume.id,
                    "extracted_text": resume.extracted_text,
                    "updated_applications": updated_applications,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            return Response(
                {"error": f"Erro ao processar o PDF: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MyResumeListAPIView(generics.ListAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(candidate=self.request.user).order_by('-id')


class ApplicationCreateAPIView(generics.CreateAPIView):
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated]


class MyApplicationListAPIView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.select_related('job', 'job__company').filter(
            candidate=self.request.user,
        ).order_by('-created_at')


class JobRankingAPIView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        job = get_object_or_404(Job, pk=self.kwargs['job_id'])

        if job.company.recruiter != self.request.user and not self.request.user.is_staff:
            return Application.objects.none()

        return Application.objects.select_related('candidate', 'job', 'job__company').filter(
            job=job,
        ).order_by('-score', 'created_at')
