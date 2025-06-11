from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from bufet.models.product import ProductStock, Product, ProductCategory
from bufet.serializers.create_update.add_product_serializer import ProductCreateUpdateSerializer
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
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class AllProductsCategoriesView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class AddProductCategoryView(CreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class AddProductView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        product = Product.objects.get(pk=response.data['product_id'])
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

class UpdateProductView(RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    lookup_field = 'product_id'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        product = Product.objects.get(pk=response.data['product_id'])
        return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)
