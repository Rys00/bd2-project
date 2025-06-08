from rest_framework import serializers

from bufet.models import Product, ProductCategory
from bufet.serializers.allergens_serilizer import AllergensSerializer
from bufet.models.contact_allergen import ContactAllergens


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = [
            'name',
        ]

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    allergens = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'prod_id',
            'name',
            'category',
            'price',
            'cost',
            'margin',
            'active',
            'allergens'
        ]

    def get_allergens(self, obj):
        contacts  = ContactAllergens.objects.filter(product=obj).select_related('allergen')
        return AllergensSerializer([c.allergen for c in contacts], many=True).data

class ProductForStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'prod_id',
            'name',
        ]

class ProductForOrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = Product
        fields = [
            'prod_id',
            'name',
            'price'
        ]
