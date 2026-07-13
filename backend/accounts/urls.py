from django.urls import path
from .views import (
    login_view, logout_view, current_user, csrf,
    change_password, check_auth
)

urlpatterns = [
    path('csrf/', csrf, name='csrf'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('me/', current_user, name='current-user'),
    path('check/', check_auth, name='check-auth'),
    path('change-password/', change_password, name='change-password'),
]
