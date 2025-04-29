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
    print(product_dict)
    for product in product_list:
        order_total += product_dict[str(product.pk)] * product.price
    return JsonResponse(
        {"order_total": order_total},
        safe=False,
    )
