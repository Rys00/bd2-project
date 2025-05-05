from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import (
    AccessToken,
    ExpiredTokenError,
)

from bufet.models.user import UserModel


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Retrieve the token from the cookies
        token = request.COOKIES.get("access_token")
        if not token:
            raise AuthenticationFailed("No token found in cookies")

        try:
            # Decode and validate the JWT token
            access_token = AccessToken(token)
            # Get the user associated with the token
            user = UserModel.objects.get(id=access_token["user_id"])

            return (user, access_token)  # Return the user and the token
        except ExpiredTokenError:
            raise AuthenticationFailed("Token expired")
        except Exception as e:
            print(e)
            raise AuthenticationFailed("Invalid token or user does not exist")
