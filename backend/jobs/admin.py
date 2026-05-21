from django.contrib import admin
from .models import Company, Job


class JobInline(admin.TabularInline):
    model = Job
    extra = 1


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'recruiter')
    search_fields = ('name',)
    list_filter = ('name',)
    inlines = [JobInline]


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'created_at')
    search_fields = ('title', 'requirements')
    list_filter = ('company', 'created_at')