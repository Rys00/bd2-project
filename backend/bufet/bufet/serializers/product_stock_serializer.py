from rest_framework import serializers
from bufet.models.product import ProductStock
from .product_serializer import Product_For_StockSerializer

class ProductStockSerializer(serializers.ModelSerializer):
    product = Product_For_StockSerializer(read_only=True)
    class Meta:
        model = ProductStock
        fields = '__all__'