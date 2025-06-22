from django.core.validators import MinValueValidator
from decimal import Decimal
from django.db import models
from .product import Product

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    sum = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.order_id}"



class OrderPosition(models.Model):
    position_id = models.AutoField(primary_key=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], null=False) #so in case product price change we have historical correct value
    amount = models.IntegerField(validators=[MinValueValidator(1)])
    value = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(max_digits=10, decimal_places=2)
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    product_name = models.TextField(null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return f"Position #{self.position_id} for Order #{self.order.order_id}"