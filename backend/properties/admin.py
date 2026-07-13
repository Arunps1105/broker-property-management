from django.contrib import admin
from .models import Property, PropertyImage, SearchHistory, PropertyDocument


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


class PropertyDocumentInline(admin.TabularInline):
    model = PropertyDocument
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        '__str__',
        'owner_name',
        'place',
        'price',
        'status',
        'created_at',
    ]

    list_filter = [
        'status',
        'place',
        'house_type',
        'created_at',
    ]

    search_fields = [
        'owner_name',
        'place',
        'primary_phone',
        'whatsapp_number',
    ]

    readonly_fields = [
        'created_at',
        'updated_at',
    ]

    inlines = [
        PropertyImageInline,
        PropertyDocumentInline,
    ]

    fieldsets = (
        ('Owner Information', {
            'fields': (
                'owner_name',
                'primary_phone',
                'whatsapp_number',
            )
        }),

        ('Location', {
            'fields': (
                'place',
                'area',
                'complete_address',
                'google_maps_link',
            )
        }),

        ('Property Details', {
            'fields': (
                'bhk',
                'floor',
                'house_type',
                'price',
                'square_feet',
            )
        }),

        ('Amenities', {
            'fields': (
                'parking',
                'water_availability',
                'power_backup',
                'furnishing_status',
            )
        }),

        ('Media', {
            'fields': (
                'property_video',
            )
        }),

        ('Additional Information', {
            'fields': (
                'facilities',
                'description',
                'broker_notes',
            )
        }),

        ('Status', {
            'fields': (
                'status',
                'created_by',
                'created_at',
                'updated_at',
            )
        }),
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = [
        'property',
        'uploaded_at',
        'order',
    ]

    list_filter = [
        'uploaded_at',
    ]


@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    list_display = [
        'property',
        'document_type',
        'uploaded_at',
    ]

    list_filter = [
        'document_type',
        'uploaded_at',
    ]


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'query',
        'searched_at',
    ]

    list_filter = [
        'searched_at',
        'user',
    ]

    search_fields = [
        'query',
        'user__username',
    ]
