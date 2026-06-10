from rest_framework import serializers
from .models import Company, Job

class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'logo_url', 'primary_color', 'description']
        read_only_fields = ['id']

    def get_logo_url(self, company):
        if not company.logo:
            return None

        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(company.logo.url)
        return company.logo.url

class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'description', 'requirements', 'created_at']
        read_only_fields = ['id', 'created_at']


class JobCreateSerializer(serializers.ModelSerializer):
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        source='company',
        write_only=True,
    )
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'company', 'company_id', 'title', 'description', 'requirements', 'created_at']
        read_only_fields = ['id', 'company', 'created_at']

    def validate_company_id(self, company):
        request = self.context.get('request')
        if request and company.recruiter != request.user:
            raise serializers.ValidationError('Voce so pode criar vagas para suas empresas.')
        return company
