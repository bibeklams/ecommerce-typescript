import React from "react";
import { Formik, Form, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createOrderThunk } from "../../redux/slices/orderSlice";

const CheckoutForm = () => {
  const dispatch = useAppDispatch();

  const { total } = useAppSelector((state) => state.cart);

  return (
    <div>
      <h1>Checkout</h1>

      <Formik
        initialValues={{
          shippingName: "",
          shippingPhone: "",
          shippingAddress: "",
          paymentMethod: "CASH_ON_DELIVERY",
        }}
        onSubmit={async (values) => {
          try {
            const order = await dispatch(
              createOrderThunk({
                shippingName: values.shippingName,
                shippingPhone: values.shippingPhone,
                shippingAddress: values.shippingAddress,
              }),
            ).unwrap();

            console.log("Order created:", order);

            // Payment logic will be added next.
          } catch (error) {
            console.error("Failed to create order:", error);
          }
        }}
      >
        <Form>
          <h2>Shipping Information</h2>

          <div>
            <label htmlFor="shippingName">Name</label>
            <Field
              id="shippingName"
              name="shippingName"
              type="text"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="shippingPhone">Phone</label>
            <Field
              id="shippingPhone"
              name="shippingPhone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="shippingAddress">Address</label>
            <Field
              id="shippingAddress"
              name="shippingAddress"
              as="textarea"
              placeholder="Enter your shipping address"
            />
          </div>

          <h2>Payment Method</h2>

          <label>
            <Field type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" />
            Cash on Delivery
          </label>

          <label>
            <Field type="radio" name="paymentMethod" value="ESEWA" />
            eSewa
          </label>

          <h2>Order Summary</h2>

          <p>Total: Rs. {total}</p>

          <button type="submit">Place Order</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CheckoutForm;
