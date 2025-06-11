from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from bufet.models.product import ProductStock, Product, ProductCategory
from bufet.serializers.create_update.add_product_serializer import ProductCreateUpdateSerializer
from bufet.serializers.product_serializer import ProductSerializer, ProductCategorySerializer

#viewing all
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
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

# viewing one sth by id
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_id'

class ProductCategoryDetailView(RetrieveAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    lookup_field = 'category_id'

# adding and updating products
class AddProductCategoryView(CreateAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class AddProductView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        product = Product.objects.get(pk=response.data['product_id'])
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

class UpdateProductView(UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    lookup_field = 'product_id'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        product = Product.objects.get(pk=response.data['product_id'])
        return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)


#deleting by id - only category, since product is used as part of orders history
class DeleteProductCategoryView(DestroyAPIView):
    #it will only work if category is not used
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    lookup_field = 'category_id'
