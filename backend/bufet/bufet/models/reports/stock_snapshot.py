from django.db import models


class ProductStockSnapshot(models.Model):
    id = models.IntegerField(primary_key=True)
    snapshot_date = models.DateField()
    product_id = models.IntegerField()
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    stock_amount = models.IntegerField()

    class Meta:
        managed = False
        db_table = "product_stock_snapshot_mv"
