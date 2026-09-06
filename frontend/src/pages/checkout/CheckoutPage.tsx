import { useEffect } from "react";

import CheckoutForm from "../../components/checkout/CheckoutForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCartThunk } from "../../redux/slices/cartSlice";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();

  const { items, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  if (loading) {
    return <p>Loading checkout...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Checkout</h1>

      <div>
        {/* Left: Products */}
        <section>
          <h2>Your Products</h2>

          {items.map((item) => (
            <div key={item.id}>
              {item.product.gallery?.images?.[0]?.url && (
                <img
                  src={item.product.gallery.images[0].url}
                  alt={item.product.name}
                  width={100}
                />
              )}

              <h3>{item.product.name}</h3>
              <p>Price: Rs. {item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </section>

        {/* Right: Checkout form */}
        <section>
          <CheckoutForm />
        </section>
      </div>
    </main>
  );
};

export default CheckoutPage;
