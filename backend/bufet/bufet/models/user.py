from django.db import models


class UserModel(models.Model):
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    password = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=40)
