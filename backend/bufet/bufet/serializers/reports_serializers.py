from rest_framework import serializers
from bufet.models.reports.today_reports import DailyReportToday, CategoryDailyReportToday, DailyReports, CategoryDailyReports

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
        fields = '__all__'

class CategoryDailyReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryDailyReports
        fields = '__all__'
