import React, { useState } from "react";
import GroupService from "../../services/GroupService";

type Props = {
  refreshGroups: () => void;
};

const GroupForm: React.FC<Props> = ({ refreshGroups }) => {
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userArray = users.split(",").map((nickname) => nickname.trim());
    userArray.push(loggedInUserData?.nickname);

    if (!name || userArray.length === 0) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      const newGroup = await GroupService.createGroup(name, userArray, message);
      setSuccessMessage(`Group "${newGroup.name}" created successfully!`);
      setErrorMessage("");
      setName("");
      setUsers("");
      setMessage("");

      refreshGroups();
    } catch (error) {
      setErrorMessage("Failed to create group. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="row">
      {!showCreateGroupForm ? (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => alert("Join a group feature not implemented yet!")}
            style={{
              padding: "15px 30px",
              marginBottom: "20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Join a Group
          </button>
          <button
            onClick={() => setShowCreateGroupForm(true)}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create a Group
          </button>
        </div>
      ) : (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <h1>Create a New Group</h1>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>Group Name:</strong>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>Users (comma-separated nicknames):</strong>
                <input
                  type="text"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  placeholder="e.g., bob56,sam4334"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>Message:</strong>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a welcome message (optional)"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Create Group
              </button>
              <button
                type="button"
                onClick={() => setShowCreateGroupForm(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupForm;
