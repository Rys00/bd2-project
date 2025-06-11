"""
URL configuration for bufet project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views.order_view import AllOrdersView, OrderDetailsView
from .views.products_view import ProductDetailView, ProductsByCategoryView, AllProductsCategoriesView, \
    AddProductCategoryView, AddProductView, AllProductsView, UpdateProductView, ProductCategoryDetailView, \
    DeleteProductCategoryView
from .views.allergens_view import AllergenDetailView, AllAllergensView, AddAllergenView, DeleteAllergenView
from .views.stock_view import AllStockView, ProductStockView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/products/<int:product_id>', ProductDetailView.as_view(),name='product-detail'),
    path('api/products_category/<int:category_id>', ProductCategoryDetailView.as_view(),name='category-detail'),
    path('api/allergens/<int:pk>', AllergenDetailView.as_view(), name='allergen-detail'),
    path('api/orders/<int:order_id>', OrderDetailsView.as_view(), name='order-detail'),
    #lists
    path('api/category/<int:category_id>/products', ProductsByCategoryView.as_view(),name='products-by-category'),
    path('api/categories/', AllProductsCategoriesView.as_view(), name='all-products-categories'),
    path('api/allergens/', AllAllergensView.as_view(), name='all-allergens'),
    path('api/products/', AllProductsView.as_view(), name='all-products'),
    path('api/stock/', AllStockView.as_view(), name='all-stock'),
    path('api/stock/product/<int:product_id>', ProductStockView.as_view(), name='stock-product'),
    path('api/orders', AllOrdersView.as_view(), name='all-orders'),
    #adding
    path('api/add/product_category', AddProductCategoryView.as_view(), name='add-product-category'),
    path('api/add/allergen', AddAllergenView.as_view(), name='add-allergen'),
    path('api/add/product', AddProductView.as_view(), name='add-product'),
    #updating
    path('api/update/product/<int:product_id>', UpdateProductView.as_view(), name='update-product'), #put and patch
    #deleting
    path('api/delete/product_category/<int:category_id>', DeleteProductCategoryView.as_view(), name='delete-product-category'),
    path('api/delete/allergen/<int:allergen_id>', DeleteAllergenView.as_view(), name='delete-allergen'),

]
