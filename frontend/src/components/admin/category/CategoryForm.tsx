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
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {editingCategory
            ? "Update the category information below."
            : "Create a new category for your store."}
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={categorySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Category Name
              </label>

              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter category name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="name"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Description
              </label>

              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                placeholder="Enter category description"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="description"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* PARENT CATEGORY */}
            <div>
              <label
                htmlFor="parentId"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Parent Category
              </label>

              <Field
                as="select"
                id="parentId"
                name="parentId"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="">No Parent</option>

                {categories
                  .filter((category) => category.id !== editingCategory?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </Field>

              <ErrorMessage
                name="parentId"
                component="p"
                className="mt-1 text-sm text-red-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Select a parent if this is a sub-category.
              </p>
            </div>

            {/* CATEGORY IMAGE */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Category Image
              </label>

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
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-black file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <ErrorMessage
                name="image"
                component="p"
                className="mt-1 text-sm text-red-600"
              />

              {/* IMAGE PREVIEW */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Image Preview
                  </p>

                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="h-36 w-36 rounded-lg border border-gray-200 object-cover shadow-sm"
                  />
                </div>
              )}

              {/* SELECTED FILE */}
              {values.image && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-medium text-gray-700">
                    {values.image.name}
                  </span>
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Add Category"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
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
