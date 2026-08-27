import type { Category } from "../../../types/category";

interface CategoryListProps {
  categories: Category[];
  onCategoryClick: (categoryId: number) => void;
}

const CategoryList = ({ categories, onCategoryClick }: CategoryListProps) => {
  return (
    <section>
      <h2>Categories</h2>

      <div>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
