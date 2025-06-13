from django.db import models

class DailyReportToday(models.Model):
    day = models.DateField(primary_key=True)
    orders_count = models.IntegerField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'daily_report_today'


class CategoryDailyReportToday(models.Model):
    day = models.DateField(primary_key=True)
    category_id = models.IntegerField()
    category_name = models.TextField()
    totals_sold = models.IntegerField()
    total_value = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'category_daily_report_today'


class DailyReports(models.Model):
    day = models.DateField(primary_key=True)
    orders_count = models.IntegerField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'daily_report_mv'

class CategoryDailyReports(models.Model):
    id = models.IntegerField(primary_key=True)
    day = models.DateField()
    category_id = models.IntegerField()
    category_name = models.TextField()
    totals_sold = models.IntegerField()
    total_value = models.DecimalField(max_digits=10, decimal_places=2)
    total_profit = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'category_daily_report_mv'
        unique_together = ('day', 'category_id')

