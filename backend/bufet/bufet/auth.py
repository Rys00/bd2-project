from django.http import HttpResponse, HttpRequest
import json
from argon2 import PasswordHasher

from bufet.models.user import UserModel


def index(request: HttpRequest):
    return HttpResponse("Hello, world. You're at the polls index.")


def login(request: HttpRequest):
    if request.method == "POST":
        # Handle login, assume correct body
        # Handle register, assume correct body
        # {
        #   "email":"email",
        #   "password":"password"
        # }
        body = json.loads(request.body)
        ph = PasswordHasher()
        user_hash = ""
        ph.verify(user_hash, body["password"])
        print(f"user: {body['email']}, pass: {body["password"]}")
    return HttpResponse(f"Login response {request.method}")


def register(request: HttpRequest):
    if request.method == "POST":
        # Double check password only on frontend

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
    return HttpResponse(f"Login response {request.method}")
