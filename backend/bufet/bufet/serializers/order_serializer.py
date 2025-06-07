from rest_framework import serializers

from bufet.models.order import Order, OrderPosition
from bufet.serializers.product_serializer import ProductSerializer, Product_For_OrderSerializer


class OrderPositionSerializer(serializers.ModelSerializer):
    product = Product_For_OrderSerializer(read_only=True)
    class Meta:
        model = OrderPosition
        fields = [
            'product',
            'amount',
            'value',
            'profit'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderPositionSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = [
            'order_id',
            'date',
            'items',
            'sum',
            'total_profit',
        ]