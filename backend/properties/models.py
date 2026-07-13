from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, FileExtensionValidator


class Property(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
    ]

    HOUSE_TYPE_CHOICES = [
        ('apartment', 'Apartment'),
        ('villa', 'Villa'),
        ('house', 'House'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
    ]

    FURNISHING_CHOICES = [
        ('unfurnished', 'Unfurnished'),
        ('semi-furnished', 'Semi-Furnished'),
        ('furnished', 'Furnished'),
    ]

    # Owner Information
    owner_name = models.CharField(max_length=100)
    primary_phone = models.CharField(max_length=15)
    whatsapp_number = models.CharField(max_length=15, blank=True)

    # Location Information
    place = models.CharField(max_length=100, db_index=True)
    area = models.CharField(max_length=100, blank=True)
    complete_address = models.TextField()
    google_maps_link = models.URLField(blank=True)
    instagram_link = models.URLField(blank=True, null=True)

    # Property Details
    bhk = models.IntegerField(validators=[MinValueValidator(1)])
    floor = models.IntegerField(null=True, blank=True)
    house_type = models.CharField(max_length=20, choices=HOUSE_TYPE_CHOICES)
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    square_feet = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])

    # Amenities
    parking = models.BooleanField(default=False)
    water_availability = models.CharField(max_length=50, blank=True)
    power_backup = models.BooleanField(default=False)
    furnishing_status = models.CharField(max_length=20, choices=FURNISHING_CHOICES, default='unfurnished')

    # Additional Info
    facilities = models.TextField(blank=True)
    description = models.TextField(blank=True)
    broker_notes = models.TextField(blank=True)

    # Media
    property_video = models.FileField(
        upload_to='property_videos/',
        blank=True,
        null=True
    )

    # Status and Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='properties')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['place', 'bhk']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"{self.bhk} BHK in {self.place} - ₹{self.price}"


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    # ImageField stores locally during development and uses Cloudinary when
    # DEFAULT_FILE_STORAGE is configured from Cloudinary environment values.
    image = models.ImageField(upload_to='broker_properties/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.property.id}"


class PropertyDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('sale_deed', 'Sale Deed'),
        ('tax_receipt', 'Tax Receipt'),
        ('ownership_certificate', 'Ownership Certificate'),
        ('other', 'Other Documents'),
    ]

    ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(
        upload_to='property_documents/',
        validators=[FileExtensionValidator(allowed_extensions=ALLOWED_EXTENSIONS)]
    )
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES, default='other')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.get_document_type_display()} for {self.property.id}"


class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=255)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']
        verbose_name_plural = 'Search Histories'

    def __str__(self):
        return f"{self.user.username} - {self.query}"
