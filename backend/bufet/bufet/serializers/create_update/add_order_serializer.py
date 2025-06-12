from django.core.validators import MinValueValidator
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from bufet.models import OrderPosition, Order, Product, ProductStock


class OrderPositionCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    amount = serializers.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        model = OrderPosition
        fields = ['product_id', 'amount']

class OrderCreateUpdateSerializer(serializers.ModelSerializer):
    items = OrderPositionCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['order_id', 'items']
        read_only_fields = ['order_id']

    @staticmethod
    def validate_items(items):
        if not items:
            raise serializers.ValidationError("Order items can't be empty")


        seen_ids = set() #so no duplicated product on order as separate positions (fewer rows in table)
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

    @transaction.atomic
    def update(self, instance, validated_data):
        """
        Updating order within the same day will change the product stock.
        """
        new_items = validated_data.get('items', [])
        now = timezone.now()

        existing_positions = {pos.product.product_id: pos for pos in instance.items.all()}
        new_product_ids = {item['product_id'] for item in new_items}
        same_day = instance.date.date() == now.date()

        for item in new_items:
            pid = item['product_id']
            amount = item['amount']

            #updating existing order position
            if pid in existing_positions:
                pos = existing_positions[pid]
                old_amount = pos.amount
                diff = amount - old_amount

                if same_day and diff != 0:
                    stock = ProductStock.objects.select_for_update().get(product_id=pid)
                    if diff > 0 and stock.amount < diff:
                        raise serializers.ValidationError(
                            f"Insufficient stock for product {pid}. Available: {stock.amount}, requested increase: {diff}")
                    stock.amount -= diff
                    stock.save()

                pos.amount = amount
                pos.value = pos.unit_price * amount
                pos.profit = (pos.unit_price - pos.product.cost) * amount
                pos.save()

            #updating by adding new order position
            else:
                product = Product.objects.get(product_id=pid)
                unit_price = product.price

                if same_day:
                    stock = ProductStock.objects.select_for_update().get(product_id=pid)
                    if stock.amount < amount:
                        raise serializers.ValidationError(
                            f"Insufficient stock for product {pid}. Available: {stock.amount}, requested: {amount}")
                    stock.amount -= amount
                    stock.save()

                OrderPosition.objects.create(
                    order=instance,
                    product=product,
                    amount=amount,
                    unit_price=unit_price,
                    value=unit_price * amount,
                    profit=(unit_price - product.cost) * amount
                )
        # removing positions not needed
        to_remove_pids = set(existing_positions.keys()) - new_product_ids
        for pid in to_remove_pids:
            pos = existing_positions[pid]
            if same_day:
                stock = ProductStock.objects.select_for_update().get(product_id=pid)
                stock.amount += pos.amount
                stock.save()
            pos.delete()

        instance.sum = sum(pos.value for pos in instance.items.all())
        instance.total_profit = sum(pos.profit for pos in instance.items.all())
        instance.save()

        return instance






