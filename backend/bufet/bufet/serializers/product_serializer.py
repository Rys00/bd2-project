from rest_framework import serializers

from bufet.models import Product, ProductCategory


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = [
            'name',
        ]

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class Product_For_StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'prod_id',
            'name',
        ]

class Product_For_OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = Product
        fields = [
            'prod_id',
            'name',
            'price'
        ]
