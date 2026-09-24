import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAppSelector } from "../../../redux/hooks";

const SellerSalesOverview = () => {
  const { salesOverview } = useAppSelector((state) => state.sellerDashboard);

  return (
    <div>
      <h2>Sales Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesOverview}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellerSalesOverview;
