from rest_framework import serializers
from bufet.models.allergen import Allergen
from bufet.models.contact_allergen import ContactAllergens
# from bufet.serializers.product_serializer import ProductForStockSerializer


class AllergensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergen
        fields = [
            'allergen_id',
            'name',
        ]

# class ContactAllergensSerializer(serializers.ModelSerializer):
#     allergens = AllergensSerializer(many=True, read_only=True)
#     products = ProductForStockSerializer(many=True, read_only=True)
#     class Meta:
#         model = ContactAllergens
#         fields = '__all__'