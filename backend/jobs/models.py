from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='company_logos/')
    primary_color = models.CharField(max_length=20)
    description = models.TextField()

    def __str__(self):
        return self.name


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
