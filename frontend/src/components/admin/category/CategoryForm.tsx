import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { Category } from "../../../types/category";

type CategoryFormData = {
  name: string;
  description: string;
  parentId: string;
  image: File | null;
};

interface CategoryFormProps {
  categories: Category[];
  editingCategory: Category | null;
  loading: boolean;

  onSubmit: (data: {
    name: string;
    description?: string;
    parentId?: number;
    image?: File;
  }) => void;

  onCancel: () => void;
}

const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must not exceed 20 characters")
    .required("Name is required"),

  description: Yup.string().trim(),

  parentId: Yup.string(),

  image: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Image must be less than 5MB", (file) => {
      if (!file) return true;

      return file.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only JPG, JPEG, PNG and WEBP are allowed", (file) => {
      if (!file) return true;

      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      );
    }),
});

const CategoryForm = ({
  categories,
  editingCategory,
  loading,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingCategory?.categoryImage?.url ?? null,
  );

  const initialValues: CategoryFormData = {
    name: editingCategory?.name ?? "",

    description: editingCategory?.description ?? "",

    parentId:
      editingCategory?.parentId !== undefined &&
      editingCategory?.parentId !== null
        ? String(editingCategory.parentId)
        : "",

    image: null,
  };

  const handleSubmit = (values: CategoryFormData) => {
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      parentId: values.parentId ? Number(values.parentId) : undefined,
      image: values.image ?? undefined,
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
        {({ setFieldValue, values }) => (
          <Form>
            {/* =========================
                NAME
            ========================== */}
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

            {/* =========================
                DESCRIPTION
            ========================== */}
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

            {/* =========================
                PARENT CATEGORY
            ========================== */}
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

            {/* =========================
                CATEGORY IMAGE
            ========================== */}
            <div>
              <label htmlFor="image">Category Image</label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;

                  setFieldValue("image", file);

                  if (file) {
                    const previewUrl = URL.createObjectURL(file);

                    setImagePreview(previewUrl);
                  } else {
                    setImagePreview(
                      editingCategory?.categoryImage?.url ?? null,
                    );
                  }
                }}
              />

              <ErrorMessage name="image" component="p" />

              {/* Image preview */}
              {imagePreview && (
                <div>
                  <p>Image Preview:</p>

                  <img
                    src={imagePreview}
                    alt="Category preview"
                    width={150}
                    height={150}
                  />
                </div>
              )}

              {/* Selected file name */}
              {values.image && <p>Selected: {values.image.name}</p>}
            </div>

            {/* =========================
                BUTTONS
            ========================== */}
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
        )}
      </Formik>
    </section>
  );
};

export default CategoryForm;
