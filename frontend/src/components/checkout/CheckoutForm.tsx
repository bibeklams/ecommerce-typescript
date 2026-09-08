import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useAppSelector } from "../../redux/hooks";
import type { CheckoutValues } from "../../types/checkout";

interface CheckoutFormProps {
  onSubmit: (values: CheckoutValues) => void | Promise<void>;
  isSubmitting: boolean;
}

const checkoutSchema = Yup.object({
  shippingName: Yup.string()
    .trim()
    .min(2, "Shipping name must be at least 2 characters")
    .max(100, "Shipping name is too long")
    .required("Shipping name is required"),

  shippingPhone: Yup.string()
    .trim()
    .min(7, "Invalid phone number")
    .max(20, "Phone number is too long")
    .required("Phone number is required"),

  shippingAddress: Yup.string()
    .trim()
    .min(5, "Shipping address is too short")
    .max(255, "Shipping address is too long")
    .required("Shipping address is required"),

  paymentMethod: Yup.string()
    .oneOf(["CASH_ON_DELIVERY", "ESEWA"], "Invalid payment method")
    .required("Payment method is required"),
});

const CheckoutForm = ({ onSubmit, isSubmitting }: CheckoutFormProps) => {
  const { total } = useAppSelector((state) => state.cart);

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      <Formik<CheckoutValues>
        initialValues={{
          shippingName: "",
          shippingPhone: "",
          shippingAddress: "",
          paymentMethod: "CASH_ON_DELIVERY",
        }}
        validationSchema={checkoutSchema}
        onSubmit={onSubmit}
      >
        <Form className="space-y-6">
          {/* Shipping Information */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Shipping Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="shippingName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <Field
                  id="shippingName"
                  name="shippingName"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <ErrorMessage
                  name="shippingName"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="shippingPhone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>

                <Field
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <ErrorMessage
                  name="shippingPhone"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="shippingAddress"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <Field
                  id="shippingAddress"
                  name="shippingAddress"
                  as="textarea"
                  rows={4}
                  placeholder="Enter your shipping address"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <ErrorMessage
                  name="shippingAddress"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 transition hover:bg-gray-50">
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-gray-700">
                  Cash on Delivery
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 transition hover:bg-gray-50">
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="ESEWA"
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-gray-700">eSewa</span>
              </label>
            </div>

            <ErrorMessage
              name="paymentMethod"
              component="p"
              className="mt-1 text-sm text-red-500"
            />
          </section>

          {/* Order Summary */}
          <section className="border-t border-gray-200 pt-5">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>

              <span className="text-xl font-bold text-gray-900">
                Rs. {total}
              </span>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CheckoutForm;
