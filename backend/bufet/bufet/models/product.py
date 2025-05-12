from django.db import models
from rest_framework import serializers

from bufet.models.alergen import AlergenModel


class ProductModel(models.Model):
    full_name = models.CharField(unique=True, max_length=40)
    # TODO category should probably be another table
    category = models.CharField(max_length=40)
    price = models.IntegerField()
    expiration_date = models.DateField()
    alergens = models.ManyToManyField(AlergenModel)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductModel
        fields = ["full_name", "category", "price", "expiration_date"]


class ProductListSerializer(serializers.Serializer):
    products = ProductSerializer(many=True)
