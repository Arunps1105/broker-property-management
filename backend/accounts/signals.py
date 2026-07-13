import os

from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile


@receiver(post_migrate)
def create_initial_superuser(sender, **kwargs):
    """Create the configured initial administrator once after migrations."""
    if sender.name != 'accounts':
        return

    user_model = get_user_model()
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'arunps')
    if user_model.objects.filter(username=username).exists():
        return

    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
    if not password:
        return

    user_model.objects.create_superuser(
        username=username,
        email=os.environ.get('DJANGO_SUPERUSER_EMAIL', 'polasseryarun123@gmail.com'),
        password=password,
    )

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
