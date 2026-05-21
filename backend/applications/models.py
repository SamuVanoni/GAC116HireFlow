from django.db import models
from django.contrib.auth.models import User
from jobs.models import Job
from django.core.exceptions import ValidationError


class Resume(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)

    pdf_file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True)

    def __str__(self):
        return self.candidate.username


class Application(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)

    score = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title}"
    
    def clean(self):
        if self.score < 0 or self.score > 100:
            raise ValidationError(
                'Score must be between 0 and 100.'
            )