from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [('properties', '0004_property_instagram_link')]

    operations = [
        migrations.RenameField(
            model_name='property',
            old_name='house_price',
            new_name='price',
        ),
    ]
