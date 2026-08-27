import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div>
      <AdminSidebar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
