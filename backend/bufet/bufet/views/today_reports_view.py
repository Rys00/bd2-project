from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from django.utils.dateparse import parse_date
from bufet.models.reports.today_reports import DailyReportToday, CategoryDailyReportToday, DailyReports, CategoryDailyReports
from bufet.serializers.reports_serializers import DailyReportsSerializer, DailyReportTodaySerializer, CategoryDailyReportsSerializer, CategoryDailyReportTodaySerializer
from bufet.models import ProductCategory


class TodayReport(ListAPIView):
    serializer_class = DailyReportTodaySerializer
    queryset = DailyReportToday.objects.all()

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

class CategoryDailyReportsByCatView(ListAPIView):
    serializer_class = CategoryDailyReportsSerializer

    def get_queryset(self):
        start_date_str = self.request.query_params.get("start_date")
        end_date_str = self.request.query_params.get("end_date")
        category_id = self.request.query_params.get("category_id")

        if not start_date_str or not end_date_str:
            raise ValidationError("Both 'start_date' and 'end_date' parameters are required.")

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        if not start_date or not end_date:
            raise ValidationError("Dates must be in format YYYY-MM-DD.")

        if start_date > end_date:
            raise ValidationError("'start_date' cannot be after 'end_date'.")

        queryset = CategoryDailyReports.objects.filter(day__range=(start_date, end_date)).order_by("day")

        if category_id:
            try:
                category_id = int(category_id)
            except ValueError:
                raise ValidationError("Parameter 'category_id' must be an integer.")

            if not ProductCategory.objects.filter(pk=category_id).exists():
                raise ValidationError(f"Category with id {category_id} does not exist.")

            queryset = queryset.filter(category_id=category_id)

        return queryset

class CategoryTodayReportByCat(ListAPIView):
    serializer_class = CategoryDailyReportTodaySerializer

    def get_queryset(self):
        queryset = CategoryDailyReportToday.objects.all()
        category_id = self.request.query_params.get("category_id")

        if category_id is not None:
            if not category_id.isdigit():
                raise ValidationError("Parameter 'category_id' must be an integer.")

            category_exists = ProductCategory.objects.filter(pk=category_id).exists()
            if not category_exists:
                raise ValidationError(f"Category with id {category_id} does not exist.")

            queryset = queryset.filter(category_id=category_id)

        return queryset
