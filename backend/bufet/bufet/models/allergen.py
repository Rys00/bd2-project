from django.db import models


class Allergen(models.Model):
    allergen_id = models.AutoField(primary_key=True)
    name = models.TextField(unique=True)

    def __str__(self):
        return self.name