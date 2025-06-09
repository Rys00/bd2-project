from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

class ProductCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.TextField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    margin = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    active = models.BooleanField(default=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name

class ProductStock(models.Model):
    stock_id = models.AutoField(primary_key=True)
    amount = models.IntegerField(validators=[MinValueValidator(0)])
    last_delivery = models.DateTimeField()
    product = models.OneToOneField(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"Stock for {self.product.name}"