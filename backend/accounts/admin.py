from django.contrib import admin
from .models import CandidateProfile


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'university', 'course')
    search_fields = ('user__username', 'university', 'course')
    list_filter = ('university',)