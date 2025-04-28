from django.db import models
from rest_framework import serializers


class ProductModel(models.Model):
    full_name = models.CharField(unique=True, max_length=40)
    category = models.CharField(max_length=40)
    price = models.IntegerField()
    expiration_date = models.DateField()


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductModel
        fields = ["full_name", "category", "price", "expiration_date"]
