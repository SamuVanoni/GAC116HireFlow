from django.contrib import admin
from .models import Resume, Application


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate')
    search_fields = ('candidate__username',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'job', 'score', 'created_at')
    search_fields = ('candidate__username', 'job__title')
    list_filter = ('score', 'created_at')