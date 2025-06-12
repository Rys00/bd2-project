from rest_framework import serializers
from django.core.validators import MinValueValidator

class StockUpdateSingularSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    change = serializers.IntegerField(validators=[MinValueValidator(0)])

class BulkUpdateStockSerializer(serializers.Serializer):
    updates = StockUpdateSingularSerializer(many=True)
