from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from bufet.models.reports.avg_customer_dayhour import AvgCustomersByWeekdayHour
from bufet.serializers.reports_serializers import AvgCustomersByWeekdayHourSerializer

class AvgCustomersByWeekdayHourView(ListAPIView):
    serializer_class = AvgCustomersByWeekdayHourSerializer

    def get_queryset(self):
        queryset = AvgCustomersByWeekdayHour.objects.all()
        weekday_num = self.request.query_params.get("weekday_num")
        if weekday_num is None:
            raise ValidationError("weekday_num is required")

        if not weekday_num.isdigit() or not (0 <= int(weekday_num) <= 6):
            raise ValidationError("Parameter 'weekday_num' must be an integer between 0 (Sunday) and 6 (Saturday).")
        queryset = queryset.filter(weekday_num=weekday_num)

        return queryset