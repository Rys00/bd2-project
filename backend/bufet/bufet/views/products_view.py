from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response

from bufet.models.product import ProductStock, Product, ProductCategory
from bufet.serializers.create.add_product_serializer import ProductCreateSerializer
from bufet.serializers.product_serializer import ProductSerializer, ProductCategorySerializer


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'


class ProductsByCategoryView(ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs.get("category_id")
        return Product.objects.filter(category_id=category_id, active=True)

class AllProductsView(ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductSerializer

class AllProductsByCategoryView(ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class AddProductCategoryView(CreateAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class AddProductView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        product = Product.objects.get(pk=response.data['product_id'])
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)