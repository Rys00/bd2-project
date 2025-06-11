from django.core.validators import MinValueValidator
from django.db import transaction
from rest_framework import serializers
from bufet.models import OrderPosition, Order, Product, ProductStock


class OrderPositionCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    amount = serializers.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        model = OrderPosition
        fields = ['product_id', 'amount']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderPositionCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['order_id', 'items']
        read_only_fields = ['order_id']

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order items can't be empty")


        seen_ids = set() #so no duplicated product on order as seperate posiotions (less rows in table)
        errors = []
        product_ids = []

        # checking order representation
        for idx, item in enumerate(items):
            pid = item.get('product_id') #so no KeyError
            if pid is None:
                errors.append(f"Error at position {idx}: product id can't be not given")
                continue
            if pid in seen_ids:
                errors.append(f"Error at position {idx}: product id is already added to this order")
            else:
                seen_ids.add(pid)
                product_ids.append(pid)

        if errors:
            raise serializers.ValidationError(errors)

        #checking products ids
        existing_ids = set(Product.objects.filter(pk__in=product_ids).values_list("product_id", flat=True))
        for idx, item in enumerate(items):
            if item['product_id'] not in existing_ids:
                errors.append(f"Item at position {idx}: Product ID {item['product_id']} does not exist.")

        if errors:
            raise serializers.ValidationError(errors)

        return items



    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")

        # getting all objects for order (less request to db)
        product_ids = [item.get('product_id') for item in items] #it is after validation so no None should be here
        # using select_for_update to block selected rows
        stocks = ProductStock.objects.select_for_update().filter(product_id__in=product_ids).select_related("product")
        stock_map = {stock.product.product_id: stock for stock in stocks}

        errors = []

        for idx, item in enumerate(items):
            pid = item['product_id']
            amount = item['amount']
            stock = stock_map.get(pid)
            if not stock:
                errors.append(f"Item {idx}: product with id {pid} does not exist in stock.")
            elif stock.amount < amount:
                errors.append(
                    f"Item {idx}: insufficient stock for product {pid}. Available: {stock.amount}, requested: {amount}.")

        if errors:
            raise serializers.ValidationError(errors)

        #creating new objects
        order = order = Order.objects.create(sum=0, total_profit=0)

        total_sum = 0
        total_profit = 0

        #creating positions
        for item in items:
            pid = item['product_id']
            amount = item['amount']
            stock = stock_map.get(pid)
            product = stock.product

            value = product.price * amount
            profit = (product.price - product.cost) * amount

            OrderPosition.objects.create(
                order = order,
                unit_price = product.price,
                product = product,
                amount = amount,
                value = value,
                profit = profit,
            )

            stock.amount -= amount
            stock.save()

            total_sum += value
            total_profit += profit

        # filling order with proper data
        order.sum = total_sum
        order.total_profit = total_profit
        order.save()

        return order




