from rest_framework import serializers
from .models import Company, Job

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'primary_color', 'description']

class JobSerializer(serializers.ModelSerializer):
    # Traz os dados resumidos da empresa junto com a vaga
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'description', 'requirements', 'created_at']