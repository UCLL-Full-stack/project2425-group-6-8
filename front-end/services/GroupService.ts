// services/GroupService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Group = {
  id: string;
  name: string;
  message?: string;
};

const createGroup = async (name: string, users: number[], message: string) => {
  try {
    const groupData = {
      name,
      users,
      message,
    };

    const response = await fetch(`${API_URL}/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
};

const getAllGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetch(`${API_URL}/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch groups");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

const getGroupById = async (groupId: string): Promise<Group> => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch group");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch group:", error);
    throw error;
  }
};

const GroupService = {
  createGroup,
  getAllGroups,
  getGroupById,
};

export default GroupService;
