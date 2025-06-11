from rest_framework import serializers
from bufet.models import Product, ProductCategory, Allergen, ContactAllergens  # Tabela pośrednia

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
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

    def update(self, instance, validated_data):
        if 'category_id' in validated_data:
            category_id = self.validate_category_id(validated_data.pop('category_id'))
            instance.category = ProductCategory.objects.get(pk=category_id)

        if 'allergens' in validated_data:
            allergen_ids = self.validate_allergens(validated_data.pop('allergens'))
            # Wyczyść stare i dodaj nowe powiązania
            ContactAllergens.objects.filter(product=instance).delete()
            for allergen_id in allergen_ids:
                ContactAllergens.objects.create(product=instance, allergen_id=allergen_id)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance