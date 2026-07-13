from django.db import migrations, models
import django.db.models.deletion
import cloudinary.models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner_name', models.CharField(max_length=100)),
                ('primary_phone', models.CharField(max_length=15)),
                ('secondary_phone', models.CharField(blank=True, max_length=15)),
                ('whatsapp_number', models.CharField(blank=True, max_length=15)),
                ('place', models.CharField(db_index=True, max_length=100)),
                ('area', models.CharField(blank=True, max_length=100)),
                ('complete_address', models.TextField()),
                ('google_maps_link', models.URLField(blank=True)),
                ('olx_link', models.URLField(blank=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('bhk', models.IntegerField()),
                ('floor', models.IntegerField(blank=True, null=True)),
                ('house_type', models.CharField(choices=[('apartment', 'Apartment'), ('villa', 'Villa'), ('house', 'House'), ('land', 'Land'), ('commercial', 'Commercial')], max_length=20)),
                ('rent', models.IntegerField()),
                ('advance', models.IntegerField(blank=True)),
                ('square_feet', models.IntegerField(blank=True, null=True)),
                ('parking', models.BooleanField(default=False)),
                ('water_availability', models.CharField(blank=True, max_length=50)),
                ('power_backup', models.BooleanField(default=False)),
                ('furnishing_status', models.CharField(choices=[('unfurnished', 'Unfurnished'), ('semi-furnished', 'Semi-Furnished'), ('furnished', 'Furnished')], default='unfurnished', max_length=20)),
                ('facilities', models.TextField(blank=True)),
                ('description', models.TextField(blank=True)),
                ('broker_notes', models.TextField(blank=True)),
                ('status', models.CharField(choices=[('available', 'Available'), ('rented', 'Rented'), ('sold', 'Sold')], db_index=True, default='available', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='properties', to='auth.user')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(folder='broker_properties/', max_length=255, verbose_name='image')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.IntegerField(default=0)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='properties.property')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='SearchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255)),
                ('searched_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='search_history', to='auth.user')),
            ],
            options={
                'verbose_name_plural': 'Search Histories',
                'ordering': ['-searched_at'],
            },
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['place', 'bhk'], name='properties_place_bhk_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['status', 'created_at'], name='properties_status_created_idx'),
        ),
    ]
