from django.db import models
from .product import Product
from .allergen import Allergen
class ContactAllergens(models.Model):
    in_allergen_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_allergens')
    allergen = models.ForeignKey(Allergen, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('product', 'allergen')

    def __str__(self):
        return f"{self.product} - {self.allergen}"