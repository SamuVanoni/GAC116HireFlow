from django.contrib.auth.models import User
from rest_framework import serializers

from .models import CandidateProfile


class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ["birth_date", "university", "course", "desired_area"]


class UserSerializer(serializers.ModelSerializer):
    candidate_profile = CandidateProfileSerializer(
        source="candidateprofile",
        read_only=True,
    )
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "candidate_profile"]

    def get_role(self, user):
        if hasattr(user, "candidateprofile"):
            return "candidate"
        if user.is_staff:
            return "admin"
        return "recruiter"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=["candidate", "recruiter"], write_only=True)
    birth_date = serializers.DateField(required=False, write_only=True)
    university = serializers.CharField(required=False, write_only=True, allow_blank=True)
    course = serializers.CharField(required=False, write_only=True, allow_blank=True)
    desired_area = serializers.CharField(required=False, write_only=True, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "role",
            "birth_date",
            "university",
            "course",
            "desired_area",
        ]

    def validate(self, attrs):
        if attrs["role"] == "candidate":
            required_fields = ["birth_date", "university", "course", "desired_area"]
            missing_fields = [field for field in required_fields if not attrs.get(field)]
            if missing_fields:
                raise serializers.ValidationError(
                    {"candidate_profile": f"Campos obrigatorios: {', '.join(missing_fields)}."}
                )
        return attrs

    def create(self, validated_data):
        role = validated_data.pop("role")
        profile_data = {
            "birth_date": validated_data.pop("birth_date", None),
            "university": validated_data.pop("university", ""),
            "course": validated_data.pop("course", ""),
            "desired_area": validated_data.pop("desired_area", ""),
        }
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if role == "candidate":
            CandidateProfile.objects.create(user=user, **profile_data)

        return user
