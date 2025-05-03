from bufet.models.order import OrderAmountProductModel, OrderModel
from bufet.django_auth.admin_auth import admin_required
from bufet.models.product import (
    ProductListSerializer,
    ProductModel,
    ProductSerializer,
)
from django.http import HttpResponse, HttpRequest, JsonResponse
import json
from argon2 import PasswordHasher

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from bufet.django_auth.cookie_auth import CookieJWTAuthentication
from bufet.models.user import UserModel
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.utils import IntegrityError
from django.core import serializers
import datetime
from django.db.models import Prefetch


@api_view(["POST"])
@permission_classes(
    [IsAuthenticated]
)  # Ensures that only authenticated users can access this view
@authentication_classes(
    [CookieJWTAuthentication]
)  # Custom authentication class
def order(request: HttpRequest):
    # We can get all other info from cookies
    # Data format
    # {
    #   products:{
    #       id:amount
    #       }
    # }
    product_dict = json.loads(request.body)["products"]
    product_list: list[ProductModel] = ProductModel.objects.filter(
        id__in=product_dict.keys()
    )
    order_total = 0
    order = OrderModel.objects.create(
        user_id=request.user,
        date=datetime.datetime.now(),
        price=0,  # will update later
    )

    # For each product, create the through model entry
    for product in product_list:
        product_id_str = str(product.pk)
        amount = product_dict[product_id_str]
        order_total += amount * product.price

        # Create entry in through model
        OrderAmountProductModel.objects.create(
            order_id=order, product_id=product, amount=amount
        )

    # Update the total price on the order
    order.price = order_total
    order.save()

    return JsonResponse(
        {"order_id": order.id, "order_total": order_total},
        safe=False,
    )


@api_view(["GET"])
@admin_required
def get_all_orders(request: HttpRequest):
    orders = OrderModel.objects.prefetch_related(
        Prefetch(
            "orderamountproductmodel_set",
            queryset=OrderAmountProductModel.objects.select_related(
                "product_id"
            ),
            to_attr="order_products",
        )
    ).select_related("user_id")

    orders_data = []

    for order in orders:
        products = [
            {
                "product_id": op.product_id.id,
                "product_name": op.product_id.full_name,
                "amount": op.amount,
                "unit_price": op.product_id.price,
            }
            for op in order.order_products
        ]

        orders_data.append(
            {
                "order_id": order.id,
                "user_id": order.user_id.id,
                "date": order.date,
                "price": order.price,
                "products": products,
            }
        )

    return JsonResponse(orders_data, safe=False)
