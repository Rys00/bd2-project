from django.http import HttpResponse, HttpRequest
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
from bufet.cookie_auth import CookieJWTAuthentication
from bufet.models.user import UserModel
from rest_framework.permissions import IsAuthenticated, AllowAny


def index(request: HttpRequest):
    return HttpResponse("Hello, world. You're at the polls index.")


def make_auth_cookie_response(user: UserModel) -> Response:
    refresh = RefreshToken.for_user(user)
    # Access the token
    access_token = str(refresh.access_token)
    response = Response(
        status=status.HTTP_200_OK,
    )
    response.set_cookie(
        "access_token",  # The cookie name
        access_token,  # The value to store (JWT)
        httponly=True,  # Prevent client-side JavaScript access
        secure=False,  # Set to True in production (HTTPS only)
        max_age=86400,  # Cookie expiration time (in seconds)
        expires=86400,  # Expiration date for cookie (optional)
    )
    return response


@api_view(["POST"])
def login(request: HttpRequest):
    # Handle login, assume correct body
    # Handle register, assume correct body
    # {
    #   "email":"email",
    #   "password":"password"
    # }
    body = json.loads(request.body)
    ph = PasswordHasher()
    user: UserModel = UserModel.objects.get(email=body["email"])
    user_hash = user.password
    try:
        ph.verify(user_hash, body["password"])
        # log the user in
        print(f"user: {body['email']}, pass: {body["password"]}")
        # Create JWT tokens
        return make_auth_cookie_response(user)
    except Exception:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@authentication_classes([])  # No authentication required for this view
@permission_classes([AllowAny])  # Allows any user, no permission required
@api_view(["POST"])
def register(request: HttpRequest):
    # Double check password only on frontend
    # This checks nothing
    # Handle register, assume correct body
    # {
    #   "first_name":"lastname",
    #   "last_name":"lastname",
    #   "email":"email",
    #   "password":"password"
    # }

    body = json.loads(request.body)
    ph = PasswordHasher()
    hash = ph.hash(body["password"])
    print(f"user: {body['email']}, pass: {body["password"]}")
    user = UserModel(
        first_name=body["first_name"],
        last_name=body["last_name"],
        email=body["email"],
        password=hash,
    )
    user.save()
    if user.id:
        # Success
        return make_auth_cookie_response(user)
    else:
        # Failure
        return HttpResponse(f"Login response {request.method}")


def verify_jwt(request: HttpRequest):
    try:
        # Decode and validate the token
        token = request.COOKIES.get("access_token")
        access_token = AccessToken(token)
        return access_token
    except Exception:
        raise AuthenticationFailed("Invalid token")


@api_view(["GET"])
@permission_classes(
    [IsAuthenticated]
)  # Ensures that only authenticated users can access this view
@authentication_classes(
    [CookieJWTAuthentication]
)  # Custom authentication class
def authenticated_view(request: HttpRequest):
    return HttpResponse("Hi")
