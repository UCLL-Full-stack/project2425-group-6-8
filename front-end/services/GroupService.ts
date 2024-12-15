const createGroup = async (name: string, users: number[], message: string) => {
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
  const loggedInUserData = JSON.parse(localStorage.getItem("loggedInUser"));

  return fetch(process.env.NEXT_PUBLIC_API_URL + "/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData.token}`
    },
  });
}

const GroupService = {
  createGroup,
  getAllGroups
}
  
export default GroupService;
  