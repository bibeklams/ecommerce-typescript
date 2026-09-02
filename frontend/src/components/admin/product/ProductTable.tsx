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
    <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900">Product List</h2>

        <p className="mt-1 text-sm text-gray-500">Manage your store products</p>
      </div>

      {/* Loading */}
      {loading && products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            {/* Table Header */}
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-700">ID</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Image</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Name</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Slug</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Price</th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Quantity
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">Media</th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-gray-50">
                  {/* ID */}
                  <td className="px-5 py-4 text-gray-600">{product.id}</td>

                  {/* IMAGE */}
                  <td className="px-5 py-4">
                    {product.gallery?.images &&
                    product.gallery.images.length > 0 ? (
                      <img
                        src={product.gallery.images[0].url}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>

                  {/* SLUG */}
                  <td className="max-w-[180px] px-5 py-4 text-gray-500">
                    <span className="block truncate">{product.slug}</span>
                  </td>

                  {/* PRICE */}
                  <td className="px-5 py-4 font-medium text-gray-900">
                    ${product.price}
                  </td>

                  {/* QUANTITY */}
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">
                      {product.inventory?.quantity ?? 0}
                    </span>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4">
                    {product.category?.name ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Unknown</span>
                    )}
                  </td>

                  {/* MEDIA */}
                  <td className="px-5 py-4">
                    {product.gallery?.media &&
                    product.gallery.media.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {product.gallery.media.map((media) => (
                          <a
                            key={media.id}
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View media
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No media</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductTable;
