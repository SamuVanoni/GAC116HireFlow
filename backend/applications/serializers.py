from rest_framework import serializers
from .models import Resume, Application
from jobs.serializers import JobSerializer

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'candidate', 'pdf_file', 'extracted_text']
        read_only_fields = ['candidate', 'extracted_text']


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate_username = serializers.CharField(source='candidate.username', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'candidate_username', 'job', 'score', 'created_at']
        read_only_fields = ['id', 'candidate_username', 'job', 'score', 'created_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    job_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job_id', 'score', 'created_at']
        read_only_fields = ['id', 'score', 'created_at']

    def validate_job_id(self, job_id):
        from jobs.models import Job

        if not Job.objects.filter(id=job_id).exists():
            raise serializers.ValidationError('Vaga nao encontrada.')
        return job_id

    def validate(self, attrs):
        request = self.context.get('request')
        job_id = attrs['job_id']

        if request and Application.objects.filter(candidate=request.user, job_id=job_id).exists():
            raise serializers.ValidationError({'job_id': 'Voce ja se candidatou a esta vaga.'})

        return attrs

    def create(self, validated_data):
        from jobs.models import Job

        job = Job.objects.get(id=validated_data['job_id'])
        return Application.objects.create(candidate=self.context['request'].user, job=job)
