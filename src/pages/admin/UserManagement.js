import { useEffect, useState } from "react";
import TableUser from "../../components/TableUser/table";
import UserModal from "../../components/UserModal";
import { Button } from "react-bootstrap";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
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

      const result = await response.json();
      setUsers(users.map((user) => (user._id === id ? result.data : user)));
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
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
      <h2>Users Management</h2>
     
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
