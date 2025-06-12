from rest_framework import serializers

from bufet.models import Product, ProductCategory, ProductStock
from bufet.serializers.allergens_serilizer import AllergensSerializer
from bufet.models.contact_allergen import ContactAllergens


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    allergens = serializers.SerializerMethodField()
    stock_amount = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'product_id',
            'name',
            'category',
            'price',
            'cost',
            'margin',
            'stock_amount',
            'active',
            'allergens'
        ]
        read_only_fields = ["product_id"]

    @staticmethod
    def get_allergens(obj):
        contacts  = ContactAllergens.objects.filter(product=obj).select_related('allergen')
        return AllergensSerializer([c.allergen for c in contacts], many=True).data

    def get_stock_amount(self, obj):
        stock = ProductStock.objects.filter(product=obj).first()
        if stock:
            return stock.amount
        return None

class ProductForStockSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id',
            'name',
            'category'
        ]

class ProductStockSerializer(serializers.ModelSerializer):
    product = ProductForStockSerializer(read_only=True)

    class Meta:
        model = ProductStock
        fields = '__all__'

class ProductForOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'product_id',
            'name',
            'price'
        ]
