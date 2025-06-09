from rest_framework.generics import ListAPIView, RetrieveAPIView

from bufet.models import ProductStock
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
