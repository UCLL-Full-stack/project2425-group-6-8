import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GroupService from "../../services/GroupService";
import UserService from "@services/UserService";

type Props = {
  refreshGroups: () => void;
};

const GroupForm: React.FC<Props> = ({ refreshGroups }) => {
  const { t } = useTranslation();
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [showJoinGroupForm, setShowJoinGroupForm] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [groupId, setGroupId] = useState("");
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

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    const userArray = [loggedInUserData?.nickname, ...users.split(",").map((nickname) => nickname.trim())];

    if (!name || userArray.length === 0) {
      setErrorMessage(t("groupForm.error.fillFields"));
      return;
    }

    try {
      const newGroup = await GroupService.createGroup(name, userArray);
      setSuccessMessage(t("groupForm.success.groupCreated", { groupName: newGroup.name }));
      setErrorMessage("");
      setName("");
      setUsers("");

      refreshGroups();
    } catch (error) {
      setErrorMessage(t("groupForm.error.createFailed"));
      console.error(error);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupId) {
      setErrorMessage(t("groupForm.error.enterGroupId"));
      return;
    }

    try {
      await GroupService.addUserToExistingGroup(Number(groupId), loggedInUserData.id);
      setSuccessMessage(t("groupForm.success.joinedGroup", { groupId }));
      setErrorMessage("");
      setGroupId("");
      refreshGroups();
    } catch (error) {
      setErrorMessage(t("groupForm.error.joinFailed"));
      console.error(error);
    }
  };

  return (
    <div className="row">
      {!showCreateGroupForm && !showJoinGroupForm ? (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowJoinGroupForm(true)}
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
            {t("groupForm.joinGroup")}
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
            {t("groupForm.createGroup")}
          </button>
        </div>
      ) : showCreateGroupForm ? (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <h1>{t("groupForm.createTitle")}</h1>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleCreateGroup}>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>{t("groupForm.groupName")}:</strong>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("groupForm.placeholder.groupName")}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid black" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>{t("groupForm.users")}:</strong>
                <input
                  type="text"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  placeholder={t("groupForm.placeholder.users")}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid black" }}
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
                {t("groupForm.submitCreate")}
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
                {t("groupForm.back")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <h1>{t("groupForm.joinTitle")}</h1>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleJoinGroup}>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <strong>{t("groupForm.groupId")}:</strong>
                <input
                  type="text"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder={t("groupForm.placeholder.groupId")}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid black" }}
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
                {t("groupForm.submitJoin")}
              </button>
              <button
                type="button"
                onClick={() => setShowJoinGroupForm(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("groupForm.back")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupForm;
