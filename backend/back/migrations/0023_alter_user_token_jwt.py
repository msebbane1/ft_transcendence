# Generated by Django 3.2.24 on 2024-03-03 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0022_user_token_jwt'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='token_jwt',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
