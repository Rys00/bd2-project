import { ProductManagerTable } from "@/components/tables/product-manager-table";
import { getProducts } from "@/lib/backend-requests/products";

const ProductsPage = async () => {
  return (
    <div>
      {<ProductManagerTable data={await getProducts()}></ProductManagerTable>}
    </div>
  );
};

export default ProductsPage;
