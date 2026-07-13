from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_broker', 'created_at']
    list_filter = ['is_broker', 'created_at']
    search_fields = ['user__username', 'user__email']
