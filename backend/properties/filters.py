import django_filters
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    place = django_filters.CharFilter(field_name='place', lookup_expr='icontains')
    bhk = django_filters.NumberFilter(field_name='bhk')
    bhk_min = django_filters.NumberFilter(field_name='bhk', lookup_expr='gte')
    bhk_max = django_filters.NumberFilter(field_name='bhk', lookup_expr='lte')
    
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    area = django_filters.CharFilter(field_name='area', lookup_expr='icontains')
    house_type = django_filters.ChoiceFilter(field_name='house_type', choices=Property.HOUSE_TYPE_CHOICES)
    status = django_filters.ChoiceFilter(field_name='status', choices=Property.STATUS_CHOICES)
    furnishing = django_filters.ChoiceFilter(field_name='furnishing_status', choices=Property.FURNISHING_CHOICES)
    
    parking = django_filters.BooleanFilter(field_name='parking')
    power_backup = django_filters.BooleanFilter(field_name='power_backup')
    
    owner_name = django_filters.CharFilter(field_name='owner_name', lookup_expr='icontains')
    primary_phone = django_filters.CharFilter(field_name='primary_phone', lookup_expr='icontains')
    
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Property
        fields = ['place', 'bhk', 'price_min', 'price_max', 'house_type', 'status']
