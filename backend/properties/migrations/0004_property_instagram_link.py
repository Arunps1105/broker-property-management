from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('properties', '0003_propertydocument_and_more')]

    operations = [
        migrations.AddField(
            model_name='property',
            name='instagram_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
