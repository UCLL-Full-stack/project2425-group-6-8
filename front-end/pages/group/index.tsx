import Head from 'next/head';
import { useEffect, useState } from 'react';
import Header from '@components/header';
import  createGroup from "../../services/GroupService";
import styles from '@styles/home.module.css';


const GroupPage = () => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert comma-separated user IDs to an array of numbers
    const userArray = users.split(",").map((id) => parseInt(id.trim()));

    if (!name || userArray.length === 0) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      const newGroup = await createGroup(name, userArray, message);
      setSuccessMessage(`Group "${newGroup.name}" created successfully!`);
      setErrorMessage(""); // Clear any previous errors
      setName(""); // Reset form fields
      setUsers("");
      setMessage("");
    } catch (error) {
      setErrorMessage("Failed to create group. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
        <Head>
        <title>Shared Grocery List</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
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
                <strong>Users (comma-separated IDs):</strong>
                <input
                type="text"
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                placeholder="e.g., 1, 2, 3"
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
        </form>
        </div>
    </>
  );
};

export default GroupPage;
