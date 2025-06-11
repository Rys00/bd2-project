from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework import status
from rest_framework.response import Response
from bufet.serializers.create_update.add_order_serializer import OrderCreateSerializer
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

class AddOrderView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        order = Order.objects.get(pk=response.data['order_id'])
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
