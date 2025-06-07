from django.db import models
from .product import Product
from .allergen import Allergen
class ConntactAllergens(models.Model):
    in_allergen_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    allergen = models.ForeignKey(Allergen, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product} - {self.allergen}"