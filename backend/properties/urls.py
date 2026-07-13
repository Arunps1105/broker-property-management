from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, SearchHistoryViewSet

router = DefaultRouter()
router.register(r'', PropertyViewSet, basename='property')
router.register(r'search-history', SearchHistoryViewSet, basename='search-history')

urlpatterns = [
    path('', include(router.urls)),
]
