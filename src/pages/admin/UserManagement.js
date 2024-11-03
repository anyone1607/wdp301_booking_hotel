import { useEffect, useState } from "react";
import TableUser from "../../components/TableUser/table";
import UserModal from "../../components/UserModal";
import { Button, Alert } from "react-bootstrap";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [originalData, setOriginalData] = useState(null); // Track original data
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

    // Validate input
    if (!formData.username || !formData.email) {
      setError("Username and email are required.");
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    // Prevent saving if no changes
    if (editingUser && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setError("No changes detected.");
      return;
    }

    try {
      const url = editingUser
        ? `http://localhost:8000/api/v1/users/${editingUser._id}`
        : "http://localhost:8000/api/v1/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Could not complete the operation.");
      }

      const result = await response.json();

      if (editingUser) {
        setUsers(
          users.map((user) => (user._id === editingUser._id ? result.data : user))
        );
      } else {
        setUsers([...users, result.data]);
      }

      setFormData({ username: "", email: "", role: "user" });
      setEditingUser(null);
      setShowModal(false);
      setError(null);
      setSuccessMessage("Operation completed successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting the form.");
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setOriginalData(user); // Save original data for comparison
    setEditingUser(user);
    setShowModal(true);
    setError(null);
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not delete user.");
      }

      setUsers(users.filter((user) => user._id !== id));
      setSuccessMessage("User deleted successfully!");
      setError(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user.");
    }
  };

  const handleBanUser = async (id, status) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}/ban`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(status ? "Could not deactivate user." : "Could not activate user.");
      }

      const result = await response.json();
      setUsers(users.map((user) => (user._id === id ? result.data : user)));
      setSuccessMessage(status ? "User deactivated successfully!" : "User activated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
      setError("Error deactivating/activating user.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Reset error when the user starts editing
    setSuccessMessage(""); // Reset success message on new edits
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:8000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Could not fetch users.");
        }
        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error loading user list.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tours-container">
      <h2>User Management</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <TableUser
        data={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleBanUser={handleBanUser}
      />
      <UserModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setFormData({ username: "", email: "", role: "user" });
        }}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        editingUser={editingUser}
      />
    </div>
  );
}

export default UserManagement;