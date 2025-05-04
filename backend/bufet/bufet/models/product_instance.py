from django.db import models

from bufet.models.product import ProductModel


class ProductInstanceModel(models.Model):
    price = (
        models.IntegerField()
    )  # Could be default or discounted if expires soon
    expiration_date = models.DateField()
    product_id = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
