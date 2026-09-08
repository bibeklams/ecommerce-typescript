import { useEffect, useState } from "react";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCartThunk } from "../../redux/slices/cartSlice";
import { createOrderThunk } from "../../redux/slices/orderSlice";
import { createPaymentThunk } from "../../redux/slices/paymentSlice";
import { initiateEsewaPayment } from "../../services/payment.service";
import type { CheckoutValues } from "../../types/checkout";
import type { EsewaPaymentData } from "../../types/payment";

import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, loading, error } = useAppSelector((state) => state.cart);

  // Get latest cart
  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  // Submit eSewa payment form
  const submitToEsewa = (paymentData: EsewaPaymentData) => {
    const form = document.createElement("form");

    form.method = "POST";

    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = String(value);

      form.appendChild(input);
    });

    document.body.appendChild(form);

    form.submit();
  };

  const handleSubmit = async (values: CheckoutValues) => {
    setIsSubmitting(true);

    try {
      // =====================================================
      // 1. CASH ON DELIVERY
      // =====================================================

      if (values.paymentMethod === "CASH_ON_DELIVERY") {
        const order = await dispatch(
          createOrderThunk({
            shippingName: values.shippingName,
            shippingPhone: values.shippingPhone,
            shippingAddress: values.shippingAddress,
          }),
        ).unwrap();

        console.log("Order created:", order);

        const payment = await dispatch(
          createPaymentThunk({
            orderId: order.id,
            method: "CASH_ON_DELIVERY",
          }),
        ).unwrap();

        console.log("Payment created:", payment);

        // Later:
        navigate(`/order-success/${order.id}`);

        return;
      }

      // =====================================================
      // 2. ESEWA
      // =====================================================

      if (values.paymentMethod === "ESEWA") {
        /*
         * IMPORTANT:
         *
         * We DO NOT create an order here.
         * We DO NOT create a payment here.
         *
         * Backend creates a pending eSewa payment attempt
         * and returns the eSewa form data.
         */

        const paymentData = await initiateEsewaPayment({
          shippingName: values.shippingName,
          shippingPhone: values.shippingPhone,
          shippingAddress: values.shippingAddress,
        });

        console.log("eSewa payment data:", paymentData);

        submitToEsewa(paymentData);
        return;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* =========================
              PRODUCTS
          ========================== */}

          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Your Products
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-gray-200 p-4"
                >
                  {/* Product Image */}

                  {item.product.gallery?.images?.[0]?.url ? (
                    <img
                      src={item.product.gallery.images[0].url}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Product Information */}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Price: Rs. {item.product.price}
                    </p>

                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      Subtotal: Rs. {Number(item.product.price) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================
              CHECKOUT FORM
          ========================== */}

          <section>
            <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
