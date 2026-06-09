from rest_framework import serializers
from .models import Resume, Application

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'candidate', 'pdf_file', 'extracted_text']
        read_only_fields = ['candidate', 'extracted_text']