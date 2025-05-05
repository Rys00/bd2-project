from bufet.models.order import OrderAmountProductModel, OrderModel
from bufet.models.product_instance import ProductInstanceModel
from bufet.django_auth.admin_auth import admin_required
from bufet.models.product import (
    ProductModel,
)
from django.http import HttpRequest, JsonResponse
from django.db.models import Count, Sum
import json

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from bufet.django_auth.cookie_auth import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
import datetime
from django.db.models import Prefetch
from django.utils import timezone


class NotEnoughStockException(Exception):
    pass


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([CookieJWTAuthentication])
def order(request: HttpRequest):

    product_dict = json.loads(request.body)["products"]
    product_list: list[ProductModel] = ProductModel.objects.annotate(
        instance_count=Count("productinstancemodel")
    ).filter(id__in=product_dict.keys())

    order_total = 0
    order = OrderModel.objects.create(
        user_id=request.user,
        date=timezone.now(),
        price=0,  # will update later
    )
    order_amount_instances = []
    delete_ids = []
    try:
        for product in product_list:
            product_id_str = str(product.pk)
            amount = product_dict[product_id_str]
            if amount > product.instance_count:
                raise NotEnoughStockException
            order_total += amount * product.price

            # Create entry in through model
            order_amount_instances.append(
                OrderAmountProductModel(
                    order_id=order, product_id=product, amount=amount
                )
            )
            ids_to_delete = [
                instance.id
                for instance in ProductInstanceModel.objects.filter(
                    product_id=product
                ).order_by("expiration_date")[:amount]
            ]
            delete_ids.extend(ids_to_delete)

    except NotEnoughStockException:
        return JsonResponse({"error": "Not enought stock to fullfill order"})

    OrderAmountProductModel.objects.bulk_create(order_amount_instances)
    # Update the total price on the order
    order.price = order_total
    order.save()
    # Update the stock entries
    ProductInstanceModel.objects.filter(id__in=delete_ids).delete()
    return JsonResponse(
        {"order_id": order.id, "order_total": order_total},
        safe=False,
    )


def format_order_list(orders):
    orders_data = []
    for order in orders:
        products = [
            {
                "product_id": op.product_id.id,
                "product_name": op.product_id.full_name,
                "amount": op.amount,
                "unit_price": op.product_id.price,
                "category": op.product_id.category,
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
    return orders_data


def prefetch_orders():
    return OrderModel.objects.prefetch_related(
        Prefetch(
            "orderamountproductmodel_set",
            queryset=OrderAmountProductModel.objects.select_related(
                "product_id"
            ),
            to_attr="order_products",
        )
    ).select_related("user_id")


@api_view(["GET"])
@admin_required
def get_all_orders(request: HttpRequest):
    orders = prefetch_orders()

    orders_data = format_order_list(orders)

    return JsonResponse(orders_data, safe=False)


@api_view(["GET"])
@admin_required
def get_all_user_orders(request: HttpRequest):
    orders = prefetch_orders().filter(user_id=request.user)

    orders_data = []

    orders_data = format_order_list(orders)

    return JsonResponse(orders_data, safe=False)


# def format_response ==


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CookieJWTAuthentication])
def total_bought_by_name(request: HttpRequest):
    product_totals = (
        OrderAmountProductModel.objects.filter(order_id__user_id=request.user)
        .select_related("product_id")
        .values("product_id", "product_id__full_name", "product_id__price")
        .annotate(total_amount=Sum("amount"))
        .annotate(total_sum=Sum("product_id__price"))
    )

    response_values = []
    for product in product_totals:
        response_values.append(
            {
                "full_name": product["product_id__full_name"],
                "amount": product["total_amount"],
                "total": product["total_sum"],
            }
        )
    return JsonResponse(response_values, safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CookieJWTAuthentication])
def total_bought_by_category(request: HttpRequest):
    product_totals = (
        OrderAmountProductModel.objects.filter(order_id__user_id=request.user)
        .select_related("product_id")
        .values("product_id__category", "product_id__price")
        .annotate(total_amount=Sum("amount"))
        .annotate(total_sum=Sum("product_id__price"))
    )

    response_values = []
    for product in product_totals:
        response_values.append(
            {
                "category": product["product_id__category"],
                "amount": product["total_amount"],
                "total": product["total_sum"],
            }
        )
    return JsonResponse(response_values, safe=False)
