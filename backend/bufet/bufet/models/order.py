from django.db import models


class OrderModel(models.Model):
    date = models.DateTimeField()
