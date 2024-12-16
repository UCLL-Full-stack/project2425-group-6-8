const createGroup = async (name: string, users: string[], message: string) => {
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
      message,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData.token}`
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
      Authorization: `Bearer ${loggedInUserData.token}`
    },
  });
}

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
      Authorization: `Bearer ${loggedInUserData.token}`
    },
  });
}

const GroupService = {
  createGroup,
  getAllGroups,
  getGroupsOfUser
}
  
export default GroupService;
  