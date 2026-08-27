import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { Seo } from "../../../types/seo";
import type { Product } from "../../../types/product";

type SeoFormData = {
  title: string;
  description: string;
  canonicalUrl: string;
  productId: string;
};

interface SeoFormProps {
  products: Product[];
  editingSeo: Seo | null;
  loading: boolean;

  onSubmit: (data: {
    title: string;
    description?: string;
    canonicalUrl?: string;
    productId: number;
  }) => void;

  onCancel: () => void;
}

const seoSchema = Yup.object({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(60, "Title cannot exceed 60 characters")
    .required("Title is required"),

  description: Yup.string().max(
    160,
    "Description cannot exceed 160 characters",
  ),

  canonicalUrl: Yup.string().url("Please enter a valid URL"),

  productId: Yup.string().required("Product is required"),
});

const SeoForm = ({
  products,
  editingSeo,
  loading,
  onSubmit,
  onCancel,
}: SeoFormProps) => {
  const initialValues: SeoFormData = {
    title: editingSeo?.title ?? "",

    description: editingSeo?.description ?? "",

    canonicalUrl: editingSeo?.canonicalUrl ?? "",

    productId: editingSeo?.productId ? String(editingSeo.productId) : "",
  };

  const handleSubmit = (values: SeoFormData) => {
    onSubmit({
      title: values.title,

      description: values.description || undefined,

      canonicalUrl: values.canonicalUrl || undefined,

      productId: Number(values.productId),
    });
  };

  return (
    <section>
      <h2>{editingSeo ? "Edit SEO" : "Add SEO"}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={seoSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          {/* Product */}
          <div>
            <label htmlFor="productId">Product</label>

            <Field as="select" id="productId" name="productId">
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Field>

            <ErrorMessage name="productId" component="p" />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title">SEO Title</label>

            <Field
              id="title"
              name="title"
              type="text"
              placeholder="Enter SEO title"
            />

            <ErrorMessage name="title" component="p" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">SEO Description</label>

            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Enter SEO description"
            />

            <ErrorMessage name="description" component="p" />
          </div>

          {/* Canonical URL */}
          <div>
            <label htmlFor="canonicalUrl">Canonical URL</label>

            <Field
              id="canonicalUrl"
              name="canonicalUrl"
              type="url"
              placeholder="https://example.com/product"
            />

            <ErrorMessage name="canonicalUrl" component="p" />
          </div>

          {/* Buttons */}
          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingSeo ? "Update SEO" : "Add SEO"}
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

export default SeoForm;
