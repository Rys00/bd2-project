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
from .routes import auth
from .routes import products
from .routes import cart
from .routes import orders
from .views.products_view import ProductDetailView, ProductsByCategoryView, AllProductsCategoriesView, \
    AddProductCategoryView, AddProductView, AllProductsView
from .views.allergens_view import AllergenDetailView, AllergenListView, AddAllergenView
from .views.stock_view import AllStockView, ProductStockView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/products/<int:pk>', ProductDetailView.as_view(),name='product-detail'),
    path('api/category/<int:category_id>/products', ProductsByCategoryView.as_view(),name='products-by-category'),
    path('api/categories/', AllProductsCategoriesView.as_view(), name='all-products-categories'),
    path('api/allergens/<int:pk>', AllergenDetailView.as_view(), name='allergen-detail' ),
    path('api/allergens/', AllergenListView.as_view(), name='allergen-list'),
    path('api/products/', AllProductsView.as_view(), name='all-products'),
    path('api/stock/', AllStockView.as_view(), name='stock'),
    path('api/stock/product/<int:product_id>', ProductStockView.as_view(), name='stock-product'),
    path('api/add/product-category', AddProductCategoryView.as_view(), name='add-product-category'),
    path('api/add/allergen', AddAllergenView.as_view(), name='add-allergen'),
    path('api/add/product', AddProductView.as_view(), name='add-product'),
    # path("auth/login",auth.login),
    # path("auth/register", auth.register),
    # path("auth/test", auth.authenticated_view),
    # path("products/get_all", products.get_all),
    # path("products/get_by_id", products.get_by_id),
    # path("products/get_by_name", products.get_by_name),
    # path("products/change_product_category", products.change_product_category),
    # path("products/delete", products.delete_product),
    # path("products/check_all_stock", products.check_all_stock),
    # path("products/check_stock_by_name", products.check_stock_by_name),
    # path("products/add_stock_by_name", products.add_stock_by_name),
    # path("products/add", products.add_product),
    # path("products/add_alllergens", products.add_allergens),
    # path("cart/add", cart.add_to_cart),
    # path("orders/new", orders.order),
    # path("orders/get_all", orders.get_all_orders),
    # path("orders/get_all_user", orders.get_all_user_orders),
    # path("orders/get_total_bought_by_name", orders.total_bought_by_name),
    # path("orders/get_user_bought_by_name", orders.user_bought_by_name),
    # path("orders/get_total_bought_by_cat", orders.total_bought_by_category),
    # path("orders/get_user_bought_by_cat", orders.user_bought_by_category),
]
