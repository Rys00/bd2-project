from rest_framework import serializers
from bufet.models import Product, ProductCategory, Allergen, ContactAllergens  # Tabela pośrednia

class ProductCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)
    allergens = serializers.ListField(
        child=serializers.IntegerField(), required=False, write_only=True
    )

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'price', 'cost', 'margin', 'active', 'category_id', 'allergens']
        read_only_fields = ['product_id']

    def validate_category_id(self, value):
        if not ProductCategory.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Category with this ID does not exist.")
        return value

    def validate_allergens(self, value):
        invalid_ids = [aid for aid in value if not Allergen.objects.filter(pk=aid).exists()]
        if invalid_ids:
            raise serializers.ValidationError(f"Invalid allergen IDs: {invalid_ids}")
        return value

    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        allergen_ids = validated_data.pop('allergens', [])
        category = ProductCategory.objects.get(pk=category_id)

        product = Product.objects.create(category=category, **validated_data)

        for allergen_id in allergen_ids:
            ContactAllergens.objects.create(product=product, allergen_id=allergen_id)

        return product
