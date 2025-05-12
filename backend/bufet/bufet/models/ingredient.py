from django.db import models


# TODO maybe individual ingredients should have alergens instead of products
# TODO actually add the ingredients later
class IngredientModel(models.Model):
    name = models.CharField(max_length=50)
