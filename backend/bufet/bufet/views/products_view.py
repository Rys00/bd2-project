from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView
from bufet.models.product import ProductStock, Product, ProductCategory
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


class AllProductsCategorieView(ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

# class AddProductView(CreateAPIView):
#     queryset = Product.objects.all()