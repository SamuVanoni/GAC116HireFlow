from django.db import models
from django.contrib.auth.models import User


class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    birth_date = models.DateField()
    university = models.CharField(max_length=255)
    course = models.CharField(max_length=255)
    desired_area = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username