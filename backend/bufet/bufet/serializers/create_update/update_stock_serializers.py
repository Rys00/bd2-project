from rest_framework import serializers

class StockUpdateSingularSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    change = serializers.IntegerField()

class BulkUpdateStockSerializer(serializers.Serializer):
    updates = StockUpdateSingularSerializer(many=True)
