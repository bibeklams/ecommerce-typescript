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
    <section>
      <h2>Category List</h2>

      {/* Loading */}
      {loading && categories.length === 0 ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Parent</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => {
              const parentCategory = categories.find(
                (parent) => parent.id === category.parentId,
              );

              return (
                <tr key={category.id}>
                  {/* ID */}
                  <td>{category.id}</td>

                  {/* IMAGE */}
                  <td>
                    {category.categoryImage?.url ? (
                      <img
                        src={category.categoryImage.url}
                        alt={category.name}
                        width={80}
                        height={80}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td>{category.name}</td>

                  {/* DESCRIPTION */}
                  <td>{category.description || "-"}</td>

                  {/* PARENT */}
                  <td>{parentCategory?.name || "No Parent"}</td>

                  {/* ACTIONS */}
                  <td>
                    <button type="button" onClick={() => onEdit(category)}>
                      Edit
                    </button>

                    <button type="button" onClick={() => onDelete(category.id)}>
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

export default CategoryTable;
