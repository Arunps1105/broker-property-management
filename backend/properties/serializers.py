from rest_framework import serializers
from .models import Property, PropertyImage, PropertyDocument, SearchHistory


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'uploaded_at', 'order']
        read_only_fields = ['uploaded_at']


class PropertyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDocument
        fields = ['id', 'file', 'document_type', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class PropertyListSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    images_count = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'owner_name', 'place', 'bhk', 'price', 'status',
            'house_type', 'created_at', 'first_image', 'images_count',
            'primary_phone', 'area'
        ]

    def get_first_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None

    def get_images_count(self, obj):
        return obj.images.count()


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    documents = PropertyDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'owner_name', 'primary_phone',
            'whatsapp_number', 'place', 'area', 'complete_address',
            'google_maps_link', 'instagram_link',
            'bhk', 'floor', 'house_type', 'price',
            'square_feet', 'parking', 'water_availability',
            'power_backup', 'furnishing_status', 'facilities',
            'description', 'broker_notes', 'status', 'created_at',
            'updated_at', 'property_video', 'images', 'documents'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    image_uploads = serializers.ListField(
        child=serializers.ImageField(max_length=None, use_url=False),
        required=False
    )
    document_uploads = serializers.ListField(
        child=serializers.FileField(max_length=None, use_url=False),
        required=False
    )
    document_types = serializers.ListField(
        child=serializers.CharField(max_length=30),
        required=False
    )

    class Meta:
        model = Property
        fields = [
            'id', 'owner_name', 'primary_phone',
            'whatsapp_number', 'place', 'area', 'complete_address',
            'google_maps_link', 'instagram_link',
            'bhk', 'floor', 'house_type', 'price',
            'square_feet', 'parking', 'water_availability',
            'power_backup', 'furnishing_status', 'facilities',
            'description', 'broker_notes', 'status',
            'property_video', 'image_uploads',
            'document_uploads', 'document_types'
        ]
        read_only_fields = ['id']

    def validate_image_uploads(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("Maximum 10 images allowed")
        return value

    def validate_document_uploads(self, value):
        allowed_extensions = set(PropertyDocument.ALLOWED_EXTENSIONS)
        for f in value:
            ext = f.name.rsplit('.', 1)[-1].lower() if '.' in f.name else ''
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported file type '.{ext}' for '{f.name}'. "
                    "Allowed types: PDF, DOC, DOCX, JPG, PNG."
                )
        return value

    def _create_documents(self, property_obj, documents_data, document_types):
        valid_types = {choice[0] for choice in PropertyDocument.DOCUMENT_TYPE_CHOICES}
        for index, doc_file in enumerate(documents_data):
            doc_type = document_types[index] if index < len(document_types) else 'other'
            if doc_type not in valid_types:
                doc_type = 'other'
            PropertyDocument.objects.create(
                property=property_obj,
                file=doc_file,
                document_type=doc_type
            )

    def create(self, validated_data):
        images_data = validated_data.pop('image_uploads', [])
        documents_data = validated_data.pop('document_uploads', [])
        document_types = validated_data.pop('document_types', [])

        property_obj = Property.objects.create(**validated_data)

        for order, image in enumerate(images_data):
            PropertyImage.objects.create(property=property_obj, image=image, order=order)

        self._create_documents(property_obj, documents_data, document_types)

        return property_obj

    def update(self, instance, validated_data):
        images_data = validated_data.pop('image_uploads', [])
        documents_data = validated_data.pop('document_uploads', [])
        document_types = validated_data.pop('document_types', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images_data:
            instance.images.all().delete()
            for order, image in enumerate(images_data):
                PropertyImage.objects.create(property=instance, image=image, order=order)

        # Documents are appended, not replaced, so previously uploaded
        # documents (e.g. Sale Deed) are never lost on a later edit.
        if documents_data:
            self._create_documents(instance, documents_data, document_types)

        return instance


class PropertyStatisticsSerializer(serializers.Serializer):
    total_properties = serializers.IntegerField()
    available_properties = serializers.IntegerField()
    sold_properties = serializers.IntegerField()
    properties_by_place = serializers.DictField()
    properties_by_bhk = serializers.DictField()
    properties_by_status = serializers.DictField()
    average_price = serializers.FloatField()
    total_property_value = serializers.FloatField()


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'searched_at']
        read_only_fields = ['searched_at']
