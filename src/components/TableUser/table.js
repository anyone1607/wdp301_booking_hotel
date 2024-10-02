import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

function TableUser({ data, handleEdit, handleDelete, handleBanUser }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card" style={{ width: "100%" }}>
      <div className="card-body">
        <div className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead className="text-primary">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>{new Date(user.updatedAt).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={user.status === "active" ? "secondary" : "success"}
                      onClick={() => handleBanUser(user._id, user.status === "active" ? "inactive" : "active")}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableUser;
