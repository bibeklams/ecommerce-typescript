import type { Category } from "../../../types/category";

interface CategoryListProps {
  categories: Category[];
  onCategoryClick: (categoryId: number) => void;
}

const CategoryList = ({ categories, onCategoryClick }: CategoryListProps) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-black">
        Categories
      </h2>

      {categories.length === 0 ? (
        <p className="text-sm text-black/50">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryClick(category.id)}
              className="group flex flex-col items-center gap-3 rounded-lg border border-black/10 bg-white p-4 text-center transition-colors hover:border-black hover:bg-black/[0.02]"
            >
              {/* Category Image */}
              {category.categoryImage?.url ? (
                <img
                  src={category.categoryImage.url}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="h-20 w-20 rounded-md object-cover grayscale transition-all duration-200 group-hover:grayscale-0"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-black/20 text-xs text-black/40">
                  No image
                </span>
              )}

              {/* Category Name */}
              <span className="text-sm font-medium text-black">
                {category.name}
              </span>

              {/* Description */}
              {category.description && (
                <small className="line-clamp-2 text-xs text-black/50">
                  {category.description}
                </small>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryList;
