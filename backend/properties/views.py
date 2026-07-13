from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg, Sum
from .models import Property, PropertyImage, PropertyDocument, SearchHistory
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer,
    PropertyCreateUpdateSerializer, PropertyStatisticsSerializer,
    SearchHistorySerializer
)
from .filters import PropertyFilter


class PropertyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['owner_name', 'place', 'complete_address', 'primary_phone', 'area']
    ordering_fields = ['price', 'created_at', 'bhk']
    ordering = ['-created_at']

    def get_queryset(self):
        return Property.objects.filter(created_by=self.request.user).prefetch_related('images', 'documents')

    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        elif self.action == 'retrieve':
            return PropertyDetailSerializer
        else:
            return PropertyCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        queryset = self.get_queryset()
        available_qs = queryset.filter(status='available')

        price_aggregates = available_qs.aggregate(
            average_price=Avg('price'),
            total_property_value=Sum('price')
        )

        stats = {
            'total_properties': queryset.count(),
            'available_properties': available_qs.count(),
            'sold_properties': queryset.filter(status='sold').count(),
            'properties_by_place': dict(
                queryset.values('place').annotate(count=Count('id')).values_list('place', 'count')
            ),
            'properties_by_bhk': dict(
                queryset.values('bhk').annotate(count=Count('id')).order_by('bhk').values_list('bhk', 'count')
            ),
            'properties_by_status': dict(
                queryset.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
            'average_price': float(price_aggregates['average_price'] or 0),
            'total_property_value': float(price_aggregates['total_property_value'] or 0),
        }

        serializer = PropertyStatisticsSerializer(stats)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent_properties(self, request):
        recent = self.get_queryset()[:5]
        serializer = PropertyListSerializer(recent, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        deleted_count, _ = Property.objects.filter(
            id__in=ids,
            created_by=request.user
        ).delete()
        return Response({'deleted': deleted_count})

    @action(detail=True, methods=['post'])
    def export_pdf(self, request, pk=None):
        property_obj = self.get_object()
        serializer = PropertyDetailSerializer(property_obj)
        return Response({
            'data': serializer.data,
            'export_type': 'pdf'
        })

    @action(detail=True, methods=['post'])
    def export_excel(self, request, pk=None):
        property_obj = self.get_object()
        serializer = PropertyDetailSerializer(property_obj)
        return Response({
            'data': serializer.data,
            'export_type': 'excel'
        })

    @action(detail=True, methods=['delete'], url_path='documents/(?P<document_id>[^/.]+)')
    def delete_document(self, request, pk=None, document_id=None):
        """Remove a single uploaded document from a property."""
        property_obj = self.get_object()
        deleted_count, _ = PropertyDocument.objects.filter(
            id=document_id, property=property_obj
        ).delete()
        if deleted_count == 0:
            return Response({'detail': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'status': 'deleted'})


class SearchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = SearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        searches = self.get_queryset()[:10]
        serializer = self.get_serializer(searches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        self.get_queryset().delete()
        return Response({'status': 'cleared'})
