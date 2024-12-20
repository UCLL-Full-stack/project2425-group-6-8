const createGroup = async (name: string, users: string[]) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  try {
    const groupData = {
      name,
      users,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData?.token}`,
      },
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const createdGroup = await response.json();
    return createdGroup;
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
};

const getAllGroups = async () => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  return fetch(process.env.NEXT_PUBLIC_API_URL + "/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData?.token}`,
    },
  });
};

const getGroupsOfUser = async (userId: number) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  return fetch(process.env.NEXT_PUBLIC_API_URL + `/groups/${userId}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData?.token}`,
    },
  });
};

const addUserToExistingGroup = async (groupId: number, userId: number) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  return fetch(process.env.NEXT_PUBLIC_API_URL + `/groups/${groupId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData?.token}`,
    },
    body: JSON.stringify({
      userId,
    }),
  });
};

const removeUserFromExistingGroup = async (groupId: number, userId: number) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  return fetch(process.env.NEXT_PUBLIC_API_URL + `/groups/${groupId}/users`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData?.token}`,
    },
    body: JSON.stringify({
      userId,
    }),
  });
};

const getGroupById = async (groupId: number) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const foundGroup = await response.json();
    return foundGroup;
  } catch (error) {
    console.error("Failed to fetch group:", error);
    throw error;
  }
};

const deleteGroup = async (groupId: number) => {
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to delete group:", error);
    throw error;
  }
};

const GroupService = {
  createGroup,
  getAllGroups,
  getGroupsOfUser,
  addUserToExistingGroup,
  getGroupById,
  removeUserFromExistingGroup,
  deleteGroup, 
};

export default GroupService;
