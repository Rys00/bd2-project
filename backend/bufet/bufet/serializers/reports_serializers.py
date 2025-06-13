from rest_framework import serializers
from bufet.models.reports.today_reports import DailyReportToday, CategoryDailyReportToday, DailyReports, CategoryDailyReports
from bufet.models.reports.stock_snapshot import ProductStockSnapshot

class DailyReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReports
        fields = '__all__'

class DailyReportTodaySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReportToday
        fields = '__all__'


class CategoryDailyReportTodaySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryDailyReportToday
        fields =  [
            'day',
            'category_id',
            'category_name',
            'totals_sold',
            'total_value',
            'total_profit'
        ]

class CategoryDailyReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryDailyReports
        fields = [
            'day',
            'category_id',
            'category_name',
            'totals_sold',
            'total_value',
            'total_profit'
        ]

class ProductStockSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductStockSnapshot
        fields = [
            "snapshot_date",
            "product_id",
            "product_name",
            "price",
            "cost",
            "stock_amount",
        ]