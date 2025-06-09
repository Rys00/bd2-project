from django.core.validators import MinValueValidator
from django.db import models
from .product import Product

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    sum = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.order_id}"



class OrderPosition(models.Model):
    position_id = models.AutoField(primary_key=True)
    amount = models.IntegerField(validators=[MinValueValidator(1)])
    value = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(max_digits=10, decimal_places=2)
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return f"Position #{self.position_id} for Order #{self.order.order_id}"