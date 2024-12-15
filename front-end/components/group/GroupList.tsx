import React from "react";

// Define the Group type
type Group = {
  id: string;
  name: string;
  message?: string;
};

// Update the props type for GroupList
interface GroupListProps {
  groups: Group[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Group List</h1>
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong> - {group.message || "No message"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups available.</p>
      )}
    </div>
  );
};

export default GroupList;
