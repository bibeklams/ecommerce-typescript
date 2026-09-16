import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SellerSidebar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
