from rest_framework.generics import ListAPIView, RetrieveAPIView
from bufet.models.allergen import Allergen
from bufet.serializers.allergens_serilizer import AllergensSerializer

class AllergenDetailView(RetrieveAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer
    lookup_field = 'pk'

class AllergenListView(ListAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer

