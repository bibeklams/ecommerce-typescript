import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

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
    categoryImage?: File;
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

      // IMPORTANT:
      // Formik uses "image",
      // API expects "categoryImage"
      categoryImage: values.image ?? undefined,
    });

    toast.success(
      editingCategory
        ? "Category updated successfully"
        : "Category added successfully",
    );
  };

  return (
    <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
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
        {({ setFieldValue, values, validateForm, submitForm }) => {
          const handleAttemptSubmit = async () => {
            const errors = await validateForm();
            const errorMessages = Object.values(errors).filter(
              Boolean,
            ) as string[];

            if (errorMessages.length > 0) {
              errorMessages.forEach((message) => toast.error(message));
              return;
            }

            submitForm();
          };

          return (
            <Form className="space-y-6">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>

                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter category name"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter category description"
                  className="w-full resize-none rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* PARENT CATEGORY */}
              <div>
                <label
                  htmlFor="parentId"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Parent Category
                </label>

                <Field
                  as="select"
                  id="parentId"
                  name="parentId"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
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

                <p className="mt-1.5 text-xs text-gray-400">
                  Select a parent if this is a sub-category.
                </p>
              </div>

              {/* CATEGORY IMAGE */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Image
                </label>

                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  <label
                    htmlFor="image"
                    className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    {values.image ? "Change image" : "Upload image"}
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] ?? null;

                      setFieldValue("image", file);

                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImagePreview(
                          editingCategory?.categoryImage?.url ?? null,
                        );
                      }
                    }}
                  />

                  {values.image && (
                    <span className="truncate text-xs text-gray-400">
                      {values.image.name}
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleAttemptSubmit}
                  disabled={loading}
                  className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-full px-6 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default CategoryForm;
