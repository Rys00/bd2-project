from django.db import models


class AvgCustomersByWeekdayHour(models.Model):
    id = models.BigAutoField(primary_key=True)
    weekday_name = models.CharField(max_length=9)
    weekday_num = models.IntegerField()
    hour = models.IntegerField()
    avg_customers = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'avg_customers_by_weekday_hour_mv'

    def __str__(self):
        return f"{self.weekday_name.strip()} {self.hour}:00"
