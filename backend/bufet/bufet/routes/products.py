from bufet.django_auth.admin_auth import admin_required
from bufet.models.product import ProductModel, ProductSerializer
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


@api_view(["GET"])
def get_all(request: HttpRequest):
    data = list(ProductModel.objects.values())
    print(data)
    return JsonResponse(data, safe=False)


@api_view(["GET"])
def get_by_id(request: HttpRequest):
    product_id = request.GET.get("id")
    data = list(ProductModel.objects.filter(id=product_id).values())[0]

    # return JsonResponse(serializers.serialize("json", data), safe=False)
    return JsonResponse(data, safe=False)


@api_view(["GET"])
def get_by_name(request: HttpRequest):
    product_name = request.GET.get("name")
    data = list(ProductModel.objects.filter(full_name=product_name).values())[
        0
    ]
    return JsonResponse(data, safe=False)


@api_view(["POST"])
@admin_required
def add_product(request: HttpRequest):
    # Parse the request for product parameters
    product = ProductSerializer(data=request.data)
    if product.is_valid():
        product.save()
        print(product.data)
        return HttpResponse("OK")
    else:
        print(product.errors)
        return HttpResponse("There was an error adding the product")
