import { Navigate, Route, Routes } from "react-router-dom";
import { adminRoutes } from "../../router/AdminRoutes";
import AdminLayout from "../../components/Layout/AdminLayout";

function AdminRoutesPage() {
  return (
    <Routes>
      <Route path="" element={<Navigate to={"/admin/dashboard"} />} />
      <Route element={<AdminLayout />}>
        {adminRoutes.map((item, index) => (
          <Route key={index} path={item.path} element={item.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default AdminRoutesPage;
