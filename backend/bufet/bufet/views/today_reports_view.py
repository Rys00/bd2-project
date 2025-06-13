from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from django.utils.dateparse import parse_date
from bufet.models.reports.today_reports import DailyReportToday, CategoryDailyReportToday, DailyReports, CategoryDailyReports
from bufet.serializers.reports_serializers import DailyReportsSerializer, DailyReportTodaySerializer, CategoryDailyReportsSerializer, CategoryDailyReportTodaySerializer


class DailyReportsView(ListAPIView):
    serializer_class = DailyReportsSerializer
    def get_queryset(self):
        start_date_str = self.request.query_params.get("start_date")
        end_date_str = self.request.query_params.get("end_date")

        if not start_date_str or not end_date_str:
            raise ValidationError("Both 'start_date' and 'end_date' parameters are required.")

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        if not start_date or not end_date:
            raise ValidationError("Dates must be in format YYYY-MM-DD.")

        if start_date > end_date:
            raise ValidationError("'start_date' cannot be after 'end_date'.")

        return DailyReports.objects.filter(day__range=(start_date, end_date)).order_by("day")

class TodayReport(ListAPIView):
    serializer_class = DailyReportTodaySerializer
    queryset = DailyReportToday.objects.all()


class CategoryDailyReportsView(ListAPIView):
    serializer_class = CategoryDailyReportsSerializer

    def get_queryset(self):
        start_date_str = self.request.query_params.get("start_date")
        end_date_str = self.request.query_params.get("end_date")

        if not start_date_str or not end_date_str:
            raise ValidationError("Both 'start_date' and 'end_date' parameters are required.")

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        if not start_date or not end_date:
            raise ValidationError("Dates must be in format YYYY-MM-DD.")

        if start_date > end_date:
            raise ValidationError("'start_date' cannot be after 'end_date'.")

        return CategoryDailyReports.objects.filter(day__range=(start_date, end_date)).order_by("day")

class CategoryTodayReport(ListAPIView):
    serializer_class = CategoryDailyReportTodaySerializer
    queryset = CategoryDailyReportToday.objects.all()


