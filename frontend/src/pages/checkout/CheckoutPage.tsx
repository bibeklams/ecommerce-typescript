import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCartThunk } from "../../redux/slices/cartSlice";
import { createOrderThunk } from "../../redux/slices/orderSlice";
import { createPaymentThunk } from "../../redux/slices/paymentSlice";
import { initiateEsewaPayment } from "../../services/payment.service";
import { getSingleProduct } from "../../services/product.service";
import type { CheckoutValues } from "../../types/checkout";
import type { EsewaPaymentData } from "../../types/payment";
import type { Product } from "../../types/product";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();

  /*
   * =====================================================
   * URL PARAMETERS
   * =====================================================
   */

  const productIdParam = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");

  const productId = productIdParam ? Number(productIdParam) : null;

  const initialQuantity = quantityParam ? Number(quantityParam) : 1;

  const isBuyNow = productId !== null;

  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  const [checkoutQuantity, setCheckoutQuantity] =
    useState<number>(initialQuantity);

  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);

  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const [buyNowError, setBuyNowError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * =====================================================
   * CART
   * =====================================================
   */

  const {
    items,
    loading: cartLoading,
    error: cartError,
  } = useAppSelector((state) => state.cart);

  /*
   * =====================================================
   * VALIDATE BUY NOW PARAMETERS
   * =====================================================
   */

  const invalidBuyNow =
    isBuyNow &&
    (!productId ||
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(checkoutQuantity) ||
      checkoutQuantity <= 0);

  /*
   * =====================================================
   * LOAD CHECKOUT DATA
   *
   * Buy Now:
   *   Load only selected product.
   *
   * Cart:
   *   Load user's cart.
   * =====================================================
   */

  useEffect(() => {
    if (isBuyNow) {
      if (invalidBuyNow || !productId) {
        return;
      }

      const loadBuyNowProduct = async () => {
        try {
          setBuyNowLoading(true);
          setBuyNowError(null);

          const product = await getSingleProduct(productId);

          setBuyNowProduct(product);
        } catch (error) {
          console.error("Failed to load Buy Now product:", error);

          setBuyNowError("Unable to load product");
        } finally {
          setBuyNowLoading(false);
        }
      };

      loadBuyNowProduct();

      return;
    }

    dispatch(getCartThunk());
  }, [dispatch, isBuyNow, invalidBuyNow, productId]);

  /*
   * =====================================================
   * CHECKOUT ITEMS
   * =====================================================
   *
   * Buy Now:
   *   Uses local checkoutQuantity.
   *
   * Cart:
   *   Uses cart items directly.
   * =====================================================
   */

  const checkoutItems = isBuyNow
    ? buyNowProduct
      ? [
          {
            id: buyNowProduct.id,
            product: buyNowProduct,
            quantity: checkoutQuantity,
          },
        ]
      : []
    : items;

  /*
   * =====================================================
   * ESEWA FORM SUBMISSION
   * =====================================================
   */

  const submitToEsewa = (paymentData: EsewaPaymentData) => {
    const form = document.createElement("form");

    form.method = "POST";

    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.entries(paymentData).forEach(([key, value]) => {
      /*
       * orderId is used internally by our backend.
       *
       * eSewa only receives the payment fields it expects.
       */

      if (key === "orderId") {
        return;
      }

      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = String(value);

      form.appendChild(input);
    });

    document.body.appendChild(form);

    form.submit();
  };

  /*
   * =====================================================
   * SUBMIT CHECKOUT
   * =====================================================
   */

  const handleSubmit = async (values: CheckoutValues) => {
    if (checkoutItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * =================================================
       * CONVERT CHECKOUT ITEMS TO ORDER ITEMS
       * =================================================
       */

      const orderItems = checkoutItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      /*
       * =================================================
       * CREATE ORDER
       * =================================================
       *
       * Backend calculates the actual product price.
       *
       * Never trust price from the frontend.
       */

      const order = await dispatch(
        createOrderThunk({
          shippingName: values.shippingName,
          shippingPhone: values.shippingPhone,
          shippingAddress: values.shippingAddress,
          items: orderItems,
        }),
      ).unwrap();

      /*
       * =================================================
       * CASH ON DELIVERY
       * =================================================
       */

      if (values.paymentMethod === "CASH_ON_DELIVERY") {
        const payment = await dispatch(
          createPaymentThunk({
            orderId: order.id,
            method: "CASH_ON_DELIVERY",
          }),
        ).unwrap();

        console.log("COD payment created:", payment);

        navigate(`/order-success/${order.id}`);

        return;
      }

      /*
       * =================================================
       * ESEWA
       * =================================================
       *
       * Order already exists.
       *
       * Backend:
       *   1. Creates pending eSewa payment
       *   2. Generates signed eSewa payment data
       *
       * Frontend:
       *   3. Submits that data to eSewa
       */

      if (values.paymentMethod === "ESEWA") {
        const paymentData = await initiateEsewaPayment(order.id);

        console.log("eSewa payment initiated:", paymentData);

        submitToEsewa(paymentData);

        return;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * =====================================================
   * INVALID BUY NOW
   * =====================================================
   */

  if (invalidBuyNow) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid product or quantity.</p>
      </div>
    );
  }

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (cartLoading || buyNowLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (cartError || buyNowError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{buyNowError ?? cartError}</p>
      </div>
    );
  }

  /*
   * =====================================================
   * EMPTY CHECKOUT
   * =====================================================
   */

  if (checkoutItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          {isBuyNow ? "Product is not available." : "Your cart is empty."}
        </p>
      </div>
    );
  }

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Your Products
            </h2>

            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-gray-200 p-4"
                >
                  {/* PRODUCT IMAGE */}

                  {item.product.gallery?.images?.[0]?.url ? (
                    <img
                      src={item.product.gallery.images[0].url}
                      alt={item.product.name}
                      className="h-24 w-24 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}

                  {/* PRODUCT INFORMATION */}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Price: Rs. {item.product.price}
                    </p>

                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-600">Quantity:</span>

                      {isBuyNow ? (
                        <div className="flex items-center overflow-hidden rounded-md border border-gray-300">
                          {/* DECREMENT */}

                          <button
                            type="button"
                            onClick={() =>
                              setCheckoutQuantity((current) =>
                                Math.max(1, current - 1),
                              )
                            }
                            disabled={checkoutQuantity <= 1}
                            className="px-3 py-1 text-lg font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          {/* QUANTITY */}

                          <span className="min-w-10 border-x border-gray-300 px-3 py-1 text-center text-sm font-medium text-gray-900">
                            {checkoutQuantity}
                          </span>

                          {/* INCREMENT */}

                          <button
                            type="button"
                            onClick={() =>
                              setCheckoutQuantity((current) => current + 1)
                            }
                            className="px-3 py-1 text-lg font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        /*
                         * Cart checkout:
                         *
                         * Cart quantity is controlled by the cart.
                         * We don't modify it directly here.
                         */

                        <span className="text-sm font-medium text-gray-700">
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    {/* SUBTOTAL */}

                    <p className="mt-2 font-semibold text-gray-900">
                      Subtotal: Rs. {Number(item.product.price) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              CHECKOUT FORM
          ================================================= */}

          <section>
            <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
