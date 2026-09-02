import type { Category } from "../../../types/category";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) => {
  return (
    <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Category List</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store categories
        </p>
      </div>

      {/* Loading */}
      {loading && categories.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-gray-50"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl bg-gray-50 py-16 text-center">
          <p className="text-sm text-gray-400">No categories found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-gray-400">
                <th className="px-4 pb-3">ID</th>
                <th className="px-4 pb-3">Image</th>
                <th className="px-4 pb-3">Name</th>
                <th className="px-4 pb-3">Description</th>
                <th className="px-4 pb-3">Parent</th>
                <th className="px-4 pb-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const parentCategory = categories.find(
                  (parent) => parent.id === category.parentId,
                );

                return (
                  <tr
                    key={category.id}
                    className="rounded-xl transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-400">{category.id}</td>

                    <td className="px-4 py-3">
                      {category.categoryImage?.url ? (
                        <img
                          src={category.categoryImage.url}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-[10px] text-gray-400">
                          None
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {category.name}
                    </td>

                    <td className="max-w-[220px] px-4 py-3 text-gray-500">
                      <span className="block truncate">
                        {category.description || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {parentCategory ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {parentCategory.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(category)}
                          className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(category.id)}
                          className="rounded-full px-4 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CategoryTable;
