# Generated by Django 3.2.25 on 2024-03-12 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0058_alter_user_limit_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='limit_status',
            field=models.CharField(default='15:50', max_length=20),
        ),
    ]