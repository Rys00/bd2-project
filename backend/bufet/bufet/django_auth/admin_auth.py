from django.http import HttpResponseForbidden
from rest_framework.exceptions import AuthenticationFailed

from bufet.django_auth.cookie_auth import CookieJWTAuthentication


def admin_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        # Create an instance of the CookieJWTAuthentication class
        auth = CookieJWTAuthentication()

        try:
            # Authenticate the user based on the cookie (access_token)
            user, token = auth.authenticate(request)

            # Ensure the user is a superuser or meets the admin condition
            if not user.is_superuser:
                return HttpResponseForbidden(
                    "You do not have permission to access this page."
                )

            # Attach the authenticated user to the request
            request.user = user
            return view_func(
                request, *args, **kwargs
            )  # Continue with the original view function

        except AuthenticationFailed:
            return HttpResponseForbidden(
                "Invalid token or user does not exist"
            )

    return _wrapped_view
