import type { Seo } from "../../../types/seo";
import type { Product } from "../../../types/product";

interface SeoTableProps {
  seoList: Seo[];
  products: Product[];
  loading: boolean;

  onEdit: (seo: Seo) => void;
  onDelete: (id: number) => void;
}

const SeoTable = ({
  seoList,
  products,
  loading,
  onEdit,
  onDelete,
}: SeoTableProps) => {
  return (
    <section>
      <h2>SEO List</h2>

      {loading && seoList.length === 0 ? (
        <p>Loading SEO...</p>
      ) : seoList.length === 0 ? (
        <p>No SEO records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Title</th>
              <th>Description</th>
              <th>Canonical URL</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {seoList.map((seo) => {
              const product = products.find(
                (product) => product.id === seo.productId,
              );

              return (
                <tr key={seo.id}>
                  <td>{seo.id}</td>

                  <td>{product?.name ?? "Unknown"}</td>

                  <td>{seo.title}</td>

                  <td>{seo.description || "-"}</td>

                  <td>{seo.canonicalUrl || "-"}</td>

                  <td>
                    <button type="button" onClick={() => onEdit(seo)}>
                      Edit
                    </button>

                    <button type="button" onClick={() => onDelete(seo.id)}>
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

export default SeoTable;
