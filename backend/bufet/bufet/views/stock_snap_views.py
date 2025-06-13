from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError, NotFound
from bufet.models.reports.stock_snapshot import ProductStockSnapshot
from bufet.models.product import  Product
from bufet.serializers.reports_serializers import ProductStockSnapshotSerializer
from datetime import datetime

class SingleProductStockHistoryView(ListAPIView):
    serializer_class = ProductStockSnapshotSerializer

    def get_queryset(self):
        product_id = self.request.query_params.get("product_id")
        start_date_str = self.request.query_params.get("start_date")
        end_date_str = self.request.query_params.get("end_date")

        if not product_id:
            raise ValidationError("Parameter 'product_id' is required.")
        try:
            product_id = int(product_id)
        except ValueError:
            raise ValidationError("'product_id' must be an integer.")

        if not Product.objects.filter(pk=product_id).exists():
            raise NotFound(detail=f"Product with id {product_id} does not exist.")

        if not start_date_str or not end_date_str:
            raise ValidationError("Both 'start_date' and 'end_date' must be provided.")
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            raise ValidationError("Dates must be in format YYYY-MM-DD.")
        if start_date > end_date:
            raise ValidationError("'start_date' cannot be later than 'end_date'.")

        return ProductStockSnapshot.objects.filter(
            product_id=product_id,
            snapshot_date__range=(start_date, end_date)
        ).order_by("snapshot_date")