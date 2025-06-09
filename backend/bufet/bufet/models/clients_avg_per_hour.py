from django.db import models

class ClientsAvgPerHour(models.Model):
    week_day = models.DecimalField(max_digits=5, decimal_places=2)
    time_slot = models.DecimalField(max_digits=5, decimal_places=2)
    client_avg=models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'report_clients_avg_per_hour_last_30days'
