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
import json


@api_view(["POST"])
@permission_classes(
    [IsAuthenticated]
)  # Ensures that only authenticated users can access this view
@authentication_classes(
    [CookieJWTAuthentication]
)  # Custom authentication class
def add_to_cart(request: HttpRequest):
    cart_cookie = request.COOKIES.get("cart")
    response = JsonResponse("", safe=False)
    product_id = json.loads(request.body)["product_id"]
    if not cart_cookie:
        product_list = {product_id: 1}
        json_list = json.dumps(product_list)
        print(json_list)
        response.set_cookie("cart", json_list)
    else:
        product_list: dict = json.loads(cart_cookie)
        if product_id in product_list.keys():
            product_list[product_id] += 1
        else:
            product_list[product_id] = 1
        print(product_list)
        json_list = json.dumps(product_list)
        response.set_cookie("cart", json_list)
    response.content = json_list
    return response
