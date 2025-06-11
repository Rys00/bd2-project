from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from bufet.models.allergen import Allergen
from bufet.serializers.allergens_serilizer import AllergensSerializer

class AllergenDetailView(RetrieveAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer
    lookup_field = 'pk'

class AllAllergensView(ListAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer

class AddAllergenView(CreateAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer

class DeleteAllergenView(RetrieveAPIView):
    queryset = Allergen.objects.all()
    serializer_class = AllergensSerializer
    lookup_field = 'allergen_id'

