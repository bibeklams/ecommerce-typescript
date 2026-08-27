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
    });
  };

  return (
    <section>
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
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
              placeholder="Enter product name"
            />

            <ErrorMessage name="name" component="p" />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug">Slug</label>

            <Field
              id="slug"
              name="slug"
              type="text"
              placeholder="Enter product slug"
            />

            <ErrorMessage name="slug" component="p" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">Description</label>

            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Enter product description"
            />

            <ErrorMessage name="description" component="p" />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price">Price</label>

            <Field
              id="price"
              name="price"
              type="number"
              placeholder="Enter price"
            />

            <ErrorMessage name="price" component="p" />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId">Category</label>

            <Field as="select" id="categoryId" name="categoryId">
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Field>

            <ErrorMessage name="categoryId" component="p" />
          </div>

          {/* Details JSON */}
          <div>
            <label htmlFor="detailsJson">Product Details</label>

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
            />

            <ErrorMessage name="detailsJson" component="p" />
          </div>

          {/* Buttons */}
          <div>
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
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

export default ProductForm;
