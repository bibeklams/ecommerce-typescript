import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { Category } from "../../../types/category";

type CategoryFormData = {
  name: string;
  description: string;
  parentId: string;
};

interface CategoryFormProps {
  categories: Category[];
  editingCategory: Category | null;
  loading: boolean;
  onSubmit: (data: {
    name: string;
    description?: string;
    parentId?: number;
  }) => void;
  onCancel: () => void;
}

const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  description: Yup.string(),

  parentId: Yup.string(),
});

const CategoryForm = ({
  categories,
  editingCategory,
  loading,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const initialValues: CategoryFormData = {
    name: editingCategory?.name ?? "",
    description: editingCategory?.description ?? "",
    parentId: editingCategory?.parentId ? String(editingCategory.parentId) : "",
  };

  const handleSubmit = (values: CategoryFormData) => {
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      parentId: values.parentId ? Number(values.parentId) : undefined,
    });
  };

  return (
    <section>
      <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={categorySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          {/* Name */}
          <div>
            <label htmlFor="name">Name</label>

            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Enter category name"
            />

            <ErrorMessage name="name" component="p" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">Description</label>

            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Enter category description"
            />

            <ErrorMessage name="description" component="p" />
          </div>

          {/* Parent Category */}
          <div>
            <label htmlFor="parentId">Parent Category</label>

            <Field as="select" id="parentId" name="parentId">
              <option value="">No Parent</option>

              {categories
                .filter((category) => category.id !== editingCategory?.id)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </Field>

            <ErrorMessage name="parentId" component="p" />
          </div>

          {/* Buttons */}
          <div>
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}
            </button>

            <button type="button" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
};

export default CategoryForm;
