import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { Product } from "../../../types/product";
import type { Category } from "../../../types/category";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  categoryId: string;
  detailsJson: string;
  images: File[];
  media: File[];
};

interface ProductFormProps {
  categories: Category[];
  editingProduct: Product | null;
  loading: boolean;
  onSubmit: (data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    categoryId: number;
    detailsJson?: object;
    images?: File[];
    media?: File[];
  }) => void;
  onCancel: () => void;
}

const productSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  slug: Yup.string()
    .min(2, "Slug must be at least 2 characters")
    .required("Slug is required"),

  description: Yup.string(),

  price: Yup.number()
    .positive("Price must be greater than 0")
    .required("Price is required"),

  categoryId: Yup.string().required("Category is required"),

  detailsJson: Yup.string().test(
    "valid-json",
    "Details must be valid JSON",
    (value) => {
      if (!value) return true;

      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
  ),
});

const ProductForm = ({
  categories,
  editingProduct,
  loading,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const initialValues: ProductFormData = {
    name: editingProduct?.name ?? "",
    slug: editingProduct?.slug ?? "",
    description: editingProduct?.description ?? "",
    price: editingProduct?.price ? String(editingProduct.price) : "",
    categoryId: editingProduct?.categoryId
      ? String(editingProduct.categoryId)
      : "",
    detailsJson: editingProduct?.detailsJson
      ? JSON.stringify(editingProduct.detailsJson, null, 2)
      : "",
    images: [],
    media: [],
  };

  const handleSubmit = (values: ProductFormData) => {
    let detailsJson: object | undefined;

    if (values.detailsJson) {
      try {
        detailsJson = JSON.parse(values.detailsJson);
      } catch {
        return;
      }
    }

    onSubmit({
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      price: Number(values.price),
      categoryId: Number(values.categoryId),
      detailsJson,
      images: values.images.length > 0 ? values.images : undefined,
      media: values.media.length > 0 ? values.media : undefined,
    });
  };

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {editingProduct
            ? "Update the product information below."
            : "Add a new product to your store."}
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Product Name
              </label>

              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter product name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="name"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* SLUG */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Slug
              </label>

              <Field
                id="slug"
                name="slug"
                type="text"
                placeholder="example-product-name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="slug"
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
                placeholder="Enter product description"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="description"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* PRICE + CATEGORY */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* PRICE */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Price
                </label>

                <Field
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />

                <ErrorMessage
                  name="price"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Category
                </label>

                <Field
                  as="select"
                  id="categoryId"
                  name="categoryId"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name="categoryId"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            {/* DETAILS JSON */}
            <div>
              <label
                htmlFor="detailsJson"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Product Details
              </label>

              <Field
                as="textarea"
                id="detailsJson"
                name="detailsJson"
                rows={8}
                placeholder={`{
  "color": "black",
  "size": "XL",
  "material": "cotton"
}`}
                className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
              />

              <ErrorMessage
                name="detailsJson"
                component="p"
                className="mt-1 text-sm text-red-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Enter valid JSON for additional product information.
              </p>
            </div>

            {/* IMAGES */}
            <div>
              <label
                htmlFor="images"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Product Images
              </label>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files ?? []);

                  setFieldValue("images", files);
                }}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-black file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-1 text-xs text-gray-500">
                Select one or more product images.
              </p>
            </div>

            {/* MEDIA */}
            <div>
              <label
                htmlFor="media"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Product Media
                <span className="ml-2 font-normal text-gray-500">
                  (Optional)
                </span>
              </label>

              <input
                id="media"
                name="media"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files ?? []);

                  setFieldValue("media", files);
                }}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-black file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional product videos or other media.
              </p>
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
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
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

export default ProductForm;
