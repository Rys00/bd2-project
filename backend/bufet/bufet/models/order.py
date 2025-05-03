from django.db import models

from bufet.models.product import ProductModel
from bufet.models.user import UserModel


class OrderModel(models.Model):
    date = models.DateTimeField()
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    price = models.IntegerField()  # Denormalizacja itp
    products = models.ManyToManyField(
        ProductModel, through="OrderAmountProductModel"
    )


class OrderAmountProductModel(models.Model):
    # TODO probably change this later
    product_id = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    order_id = models.ForeignKey(OrderModel, on_delete=models.CASCADE)
    amount = models.IntegerField()
