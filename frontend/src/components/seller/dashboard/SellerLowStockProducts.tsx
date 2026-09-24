import { useAppSelector } from "../../../redux/hooks";

const SellerLowStockProducts = () => {
  const { lowStockProducts } = useAppSelector((state) => state.sellerDashboard);

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-sm font-medium text-gray-900">
          Low Stock Products
        </h2>
      </div>

      {lowStockProducts.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500">
          No products are low on stock.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lowStockProducts.map((product) => {
                const image = product.gallery?.images?.[0]?.url;
                const quantity = product.inventory?.quantity ?? 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-500">{product.id}</td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-md border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-200 text-[10px] text-gray-400">
                            No image
                          </div>
                        )}

                        <span className="truncate font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          quantity === 0
                            ? "bg-red-50 text-red-700 ring-red-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        {quantity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerLowStockProducts;
