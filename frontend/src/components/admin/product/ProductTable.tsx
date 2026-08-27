import type { Product } from "../../../types/product";
import type { Category } from "../../../types/category";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({
  products,
  categories,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <section>
      <h2>Product List</h2>

      {loading && products.length === 0 ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const category = categories.find(
                (category) => category.id === product.categoryId,
              );

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>

                  <td>{product.name}</td>

                  <td>{product.slug}</td>

                  <td>{product.price}</td>

                  <td>{category?.name ?? "Unknown"}</td>

                  <td>
                    <button type="button" onClick={() => onEdit(product)}>
                      Edit
                    </button>

                    <button type="button" onClick={() => onDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ProductTable;
