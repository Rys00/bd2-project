from rest_framework.generics import ListAPIView, RetrieveAPIView, GenericAPIView
from django.db import transaction
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status
from bufet.models import ProductStock, Product
from bufet.serializers.create_update.update_stock_serializers import BulkUpdateStockSerializer
from bufet.serializers.product_stock_serializer import ProductStockSerializer

class AllStockView(ListAPIView):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer

class ProductStockView(RetrieveAPIView):
    serializer_class = ProductStockSerializer
    lookup_field = 'product_id'

    def get_queryset(self):
        return ProductStock.objects.select_related('product', 'product__category')

    def get_object(self):
        product_id = self.kwargs['product_id']
        return self.get_queryset().get(product__product_id=product_id)

#upadting, adding not required since it is added with product
class BulkUpdatingStockView(GenericAPIView):
    serializer_class = BulkUpdateStockSerializer

    def patch(self, request, *args, **kwargs):
        return self.update(request)

    def put(self, request, *args, **kwargs):
        return self.update(request)

    @transaction.atomic
    def update(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updates = serializer.validated_data.pop('updates')

        product_ids = [item.get('product_id') for item in updates]

        #chedking whether products ids are correct
        existing_product_ids = set(
            Product.objects.filter(product_id__in=product_ids).values_list('product_id', flat=True))
        missing_product_ids = set(product_ids) - existing_product_ids
        if missing_product_ids:
            raise ValidationError({
                "missing_products": f"Product(s) with ID(s) do not exist: {sorted(missing_product_ids)}"
            })

        #checking whether products stock is existing, also selecting with lock
        stocks = ProductStock.objects.select_for_update().filter(product_id__in=product_ids)
        stock_map = {stock.product_id: stock for stock in stocks}

        missing_stocks = set(product_ids) - stock_map.keys()
        if missing_stocks:
            raise ValidationError({
                "missing_stocks": f"No stock record for product_id(s): {sorted(missing_stocks)}"
            })

        #upadting
        updated_stocks =[]
        for update in updates:
            product_id = update.get('product_id')
            change = update.get('change')
            stock = stock_map.get(product_id)

            new_amount = stock.amount + change
            if new_amount < 0:
                raise ValidationError({
                    "product_id": product_id,
                    "error": f"Stock cannot be negative. Current: {stock.amount}, change: {change}"
                })

            stock.amount = new_amount
            # positive if delivery, minus changed means corrections
            if change > 0:
                stock.last_delivery = timezone.now()
            updated_stocks.append(stock)

        ProductStock.objects.bulk_update(updated_stocks, ['amount', 'last_updated'])

        return Response(
            ProductStockSerializer(updated_stocks, many=True).data,
            status=status.HTTP_200_OK
        )
