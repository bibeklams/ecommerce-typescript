import type { Product } from "../../../types/product";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <section>
      <h2>Product List</h2>

      {/* Loading */}
      {loading && products.length === 0 ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Category</th>
              <th>Media</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                {/* =====================
                    ID
                ====================== */}
                <td>{product.id}</td>

                {/* =====================
                    IMAGE
                ====================== */}
                <td>
                  {product.gallery?.images &&
                  product.gallery.images.length > 0 ? (
                    <img
                      src={product.gallery.images[0].url}
                      alt={product.name}
                      width={80}
                      height={80}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>

                {/* =====================
                    NAME
                ====================== */}
                <td>{product.name}</td>

                {/* =====================
                    SLUG
                ====================== */}
                <td>{product.slug}</td>

                {/* =====================
                    PRICE
                ====================== */}
                <td>{product.price}</td>

                {/* =====================
                    CATEGORY
                ====================== */}
                <td>{product.category?.name ?? "Unknown"}</td>

                {/* =====================
                    MEDIA
                ====================== */}
                <td>
                  {product.gallery?.media &&
                  product.gallery.media.length > 0 ? (
                    <div>
                      {product.gallery.media.map((media) => (
                        <div key={media.id}>
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View media
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>No media</span>
                  )}
                </td>

                {/* =====================
                    ACTIONS
                ====================== */}
                <td>
                  <button type="button" onClick={() => onEdit(product)}>
                    Edit
                  </button>

                  <button type="button" onClick={() => onDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ProductTable;
