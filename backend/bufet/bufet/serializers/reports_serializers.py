from rest_framework import serializers
from bufet.models.daily_sales_report import DailySalesReport
from bufet.models.clients_avg_per_hour import ClientsAvgPerHour

class DailySalesReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySalesReport
        fields = '__all__'


class ClientsAvgPerHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAvgPerHour
        fields = '__all__'

