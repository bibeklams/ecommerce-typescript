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
    <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900">Category List</h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your store categories
        </p>
      </div>

      {/* Loading */}
      {loading && categories.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No categories found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            {/* Table Header */}
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-700">ID</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Image</th>

                <th className="px-5 py-4 font-semibold text-gray-700">Name</th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Description
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Parent
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => {
                const parentCategory = categories.find(
                  (parent) => parent.id === category.parentId,
                );

                return (
                  <tr key={category.id} className="transition hover:bg-gray-50">
                    {/* ID */}
                    <td className="px-5 py-4 text-gray-600">{category.id}</td>

                    {/* IMAGE */}
                    <td className="px-5 py-4">
                      {category.categoryImage?.url ? (
                        <img
                          src={category.categoryImage.url}
                          alt={category.name}
                          className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {category.name}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="max-w-[250px] px-5 py-4 text-gray-600">
                      <span className="block truncate">
                        {category.description || "-"}
                      </span>
                    </td>

                    {/* PARENT */}
                    <td className="px-5 py-4">
                      {parentCategory ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {parentCategory.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No Parent</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(category)}
                          className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(category.id)}
                          className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
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
