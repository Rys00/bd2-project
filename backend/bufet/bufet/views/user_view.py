from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotFound, PermissionDenied

User = get_user_model()

class MakeUserAdminView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Only admins can assign admin rights.")

        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        print(email)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        user.is_staff = True
        user.save()
        return Response({"message": f"{user.email} is now an admin."}, status=status.HTTP_200_OK)


class RemoveAdminRightsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Only admins can remove admin rights.")

        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if not user.is_staff:
            return Response({"message": f"{user.email} is not an admin."}, status=status.HTTP_400_BAD_REQUEST)

        admin_count = User.objects.filter(is_staff=True).count()
        if admin_count <= 1:
            return Response({"error": "Cannot remove admin rights. At least one admin must remain."},
                            status=status.HTTP_400_BAD_REQUEST)

        user.is_staff = False
        user.save()
        return Response({"message": f"{user.email} is no longer an admin."}, status=status.HTTP_200_OK)