from rest_framework import serializers
from bufet.models.product import ProductStock
from .product_serializer import ProductForStockSerializer

class ProductStockSerializer(serializers.ModelSerializer):
    product = ProductForStockSerializer(read_only=True)
    class Meta:
        model = ProductStock
        fields = '__all__'