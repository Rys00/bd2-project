from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from bufet.serializers.order_serializer import OrderSerializer, OrderPositionSerializer
from bufet.models import Order, OrderPosition

#list
class AllOrdersView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

#detail by id
class OrderDetailsView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_id'