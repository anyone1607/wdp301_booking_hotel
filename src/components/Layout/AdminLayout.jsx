import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Sidebar/Sidebar";

function AdminLayout({ title }) {
  return (
    <div className="d-flex">
      <SideBar />
      <div
        style={{
          marginLeft: "260px",
          padding: "20px",
          width: "100%",
          maxWidth: "calc(100% - 260px)",
        }}
      >
        {title && (
          <>
            <h2>{title}</h2>
            <hr />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
