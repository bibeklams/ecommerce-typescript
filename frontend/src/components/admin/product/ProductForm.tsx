import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { Product } from "../../../types/product";
import type { Category } from "../../../types/category";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  quantity: string;
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
    quantity: number;
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

  quantity: Yup.number()
    .integer("Quantity must be a whole number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),

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

    price:
      editingProduct?.price !== undefined ? String(editingProduct.price) : "",

    quantity:
      editingProduct?.inventory?.quantity !== undefined
        ? String(editingProduct.inventory.quantity)
        : "",

    categoryId:
      editingProduct?.categoryId !== undefined
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
      quantity: Number(values.quantity),
      categoryId: Number(values.categoryId),
      detailsJson,
      images: values.images.length > 0 ? values.images : undefined,
      media: values.media.length > 0 ? values.media : undefined,
    });
  };

  return (
    <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
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
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>

              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter product name"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
              />

              <ErrorMessage
                name="name"
                component="p"
                className="mt-1.5 text-xs text-red-500"
              />
            </div>

            {/* SLUG */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug
              </label>

              <Field
                id="slug"
                name="slug"
                type="text"
                placeholder="example-product-name"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
              />

              <ErrorMessage
                name="slug"
                component="p"
                className="mt-1.5 text-xs text-red-500"
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
                placeholder="Enter product description"
                className="w-full resize-none rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
              />

              <ErrorMessage
                name="description"
                component="p"
                className="mt-1.5 text-xs text-red-500"
              />
            </div>

            {/* PRICE + QUANTITY */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* PRICE */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price
                </label>

                <Field
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  placeholder="Enter price"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
                />

                <ErrorMessage
                  name="price"
                  component="p"
                  className="mt-1.5 text-xs text-red-500"
                />
              </div>

              {/* QUANTITY */}
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>

                <Field
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
                />

                <ErrorMessage
                  name="quantity"
                  component="p"
                  className="mt-1.5 text-xs text-red-500"
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label
                htmlFor="categoryId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <Field
                as="select"
                id="categoryId"
                name="categoryId"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
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
                className="mt-1.5 text-xs text-red-500"
              />
            </div>

            {/* DETAILS JSON */}
            <div>
              <label
                htmlFor="detailsJson"
                className="mb-2 block text-sm font-medium text-gray-700"
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
                className="w-full resize-y rounded-xl bg-gray-50 px-4 py-3 font-mono text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900"
              />

              <ErrorMessage
                name="detailsJson"
                component="p"
                className="mt-1.5 text-xs text-red-500"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Enter valid JSON for additional product information.
              </p>
            </div>

            {/* IMAGES */}
            <div>
              <label
                htmlFor="images"
                className="mb-2 block text-sm font-medium text-gray-700"
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
                className="block w-full cursor-pointer rounded-xl bg-gray-50 text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Select one or more product images.
              </p>
            </div>

            {/* MEDIA */}
            <div>
              <label
                htmlFor="media"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Media
                <span className="ml-2 font-normal text-gray-400">
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
                className="block w-full cursor-pointer rounded-xl bg-gray-50 text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Optional product videos or other media.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-full px-6 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
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
