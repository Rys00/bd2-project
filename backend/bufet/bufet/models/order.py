from django.db import models

from bufet.models.user import UserModel


class OrderModel(models.Model):
    date = models.DateTimeField()
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    price = models.IntegerField()  # Denormalizacja itp
