import { useAppSelector } from "../../../redux/hooks";
import OrderCard from "./OrderCard";

const OrderList = () => {
  const { orders, loading, error } = useAppSelector((state) => state.order);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
