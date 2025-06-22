from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from bufet.serializers.create_update.add_order_serializer import OrderCreateUpdateSerializer
from bufet.serializers.order_serializer import OrderSerializer, OrderPositionSerializer
from bufet.models import Order
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

#list
class AllOrdersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrdersByDatesView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if not start_date or not end_date:
            raise ValidationError('Start date and end date are required')
        #usigng try catch to specify formats
        try:
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
            end_date = make_aware(
                datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1) - timedelta(seconds=1)
            )
        except ValueError:
            raise ValidationError('Start date and end date need to be in YYYY-MM-DD')

        if start_date > end_date:
            raise ValidationError("Start date must be before or equal to end date.")

        return Order.objects.filter(date__range=(start_date, end_date))



#detail by id
class OrderDetailsView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_id'

class AddOrderView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        order = Order.objects.get(pk=response.data['order_id'])
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class UpdateOrderView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateUpdateSerializer
    lookup_field = 'order_id'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        order = Order.objects.get(pk=response.data['order_id'])
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
