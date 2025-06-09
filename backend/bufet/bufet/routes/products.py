# from bufet.models.allergen import AllergenModel
# from bufet.django_auth.admin_auth import admin_required
# from bufet.models.product import ProductModel, ProductSerializer
# from bufet.models.product_instance import ProductInstanceModel
# from django.http import HttpResponse, HttpRequest, JsonResponse
# import json
# import datetime
# from django.db.models import Count
# from rest_framework.decorators import (
#     api_view,
# )
#
#
# @api_view(["GET"])
# def get_all(request: HttpRequest):
#     data = list(ProductModel.objects.values())
#     print(data)
#     return JsonResponse(data, safe=False)
#
#
# @api_view(["GET"])
# def get_by_id(request: HttpRequest):
#     product_id = request.GET.get("id")
#     data = list(
#         ProductModel.objects.prefetch_related("allergens").filter(id=product_id)
#     )[0]
#
#     # return JsonResponse(serializers.serialize("json", data), safe=False)
#     return JsonResponse(serialize_product(data), safe=False)
#
#
# def serialize_product(product: ProductModel) -> dict:
#     return {
#         "id": product.id,
#         "full_name": product.full_name,
#         "category": product.category,
#         "base_price": product.price,
#         "allergens": [allergen.name for allergen in product.allergens.all()],
#     }
#
#
# @api_view(["GET"])
# def get_by_name(request: HttpRequest):
#     product_name = request.GET.get("name")
#     product = list(
#         ProductModel.objects.prefetch_related("allergens").filter(
#             full_name=product_name
#         )
#     )[0]
#     return JsonResponse(serialize_product(product), safe=False)
#
#
# @api_view(["POST"])
# @admin_required
# # TODO add allergens
# def add_product(request: HttpRequest):
#     # Parse the request for product parameters
#     product = ProductSerializer(data=request.data)
#     if product.is_valid():
#         product.save()
#         print(product.data)
#         return HttpResponse("OK")
#     else:
#         print(product.errors)
#         return HttpResponse("There was an error adding the product")
#
#
# @api_view(["POST"])
# @admin_required
# def change_product_category(request: HttpRequest):
#     # Parse the request for product parameters
#     body = json.loads(request.body)
#     product = list(
#         ProductModel.objects.filter(full_name=body["product_name"])
#     )[0]
#     # TODO verify categoru validity
#     product.category = body["category_name"]
#     product.save()
#     return HttpResponse("OK")
#
#
# @api_view(["POST"])
# @admin_required
# def delete_product(request: HttpRequest):
#     # Parse the request for product parameters
#     body = json.loads(request.body)
#     ProductModel.objects.filter(full_name=body["name"]).delete()
#     return HttpResponse("OK")
#
#
# @api_view(["GET"])
# @admin_required
# def check_stock_by_name(request: HttpRequest):
#     # Parse the request for product parameters
#     products_with_instance_count = list(
#         ProductModel.objects.filter(
#             full_name=request.GET.get("full_name")
#         ).annotate(instance_count=Count("productinstancemodel"))
#     )[0]
#     response_data = {
#         products_with_instance_count.full_name: products_with_instance_count.instance_count
#     }
#     return JsonResponse(response_data, safe=False)
#
#
# @api_view(["GET"])
# @admin_required
# def check_all_stock(request: HttpRequest):
#     # Parse the request for product parameters
#     # Annotate each ProductModel with the count of related ProductInstanceModel
#     products_with_instance_count = ProductModel.objects.annotate(
#         instance_count=Count("productinstancemodel")
#     )
#     response_data = []
#     for product in products_with_instance_count:
#         response_data.append({product.full_name: product.instance_count})
#     return JsonResponse(data=response_data, safe=False)
#
#
# @api_view(["POST"])
# @admin_required
# def add_stock_by_name(request: HttpRequest):
#     # Parse the request for product parameters
#     data: dict = json.loads(request.body)
#     # Annotate each ProductModel with the count of related ProductInstanceModel
#     product = list(
#         ProductModel.objects.filter(full_name=data["product_name"])
#     )[0]
#     price = data.get("price", product.price)
#     date = datetime.datetime.strptime(data["expiration_date"], "%Y-%m-%d")
#     instances = [
#         ProductInstanceModel(
#             price=price,
#             expiration_date=date,
#             product_id=product,
#         )
#         for _ in range(data["quantity"])
#     ]
#     ProductInstanceModel.objects.bulk_create(instances)
#
#     return HttpResponse("OK")
#
#
# @api_view(["POST"])
# @admin_required
# def add_allergens(request: HttpRequest):
#     # Parse the request for product parameters
#     data: dict = json.loads(request.body)
#     # Annotate each ProductModel with the count of related ProductInstanceModel
#     product = list(
#         ProductModel.objects.filter(full_name=data["product_name"])
#     )[0]
#     allergens = list(AllergenModel.objects.filter(name__in=data["allergens"]))
#     if len(allergens) < len(data["allergens"]):
#         print("Error, an allergen was not found")
#         return HttpResponse("Not OK")
#     allergen_ids = [allergen.id for allergen in allergens]
#     product.allergens.add(*allergen_ids)
#     product.save()
#
#     return HttpResponse("OK")
