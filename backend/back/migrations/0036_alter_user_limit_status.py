# Generated by Django 3.2.25 on 2024-03-10 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0035_alter_user_limit_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='limit_status',
            field=models.CharField(default='01:14', max_length=20),
        ),
    ]
