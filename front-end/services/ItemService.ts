import { Item } from "@types";

const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};

const getAllItems = async (): Promise<Item[]> => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch items.");
  }

  const data = await response.json();
  return data; 
};


const getItemsByGroupId = async (groupId: number): Promise<Item[]> => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/items`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch items for group ID ${groupId}`);
  }

  const data = await response.json();
  return data;
};


const getItemById = async (id: number): Promise<Item> => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch item with ID ${id}`);
  }

  const data = await response.json();
  return data; 
};

const createItem = async (item: Item) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to create item.");
  }


  const data = await response.json();
  
  return data; 
};

const updateItem = async (id: number | undefined, updatedItem: Item) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
    body: JSON.stringify(updatedItem),
  });

  if (!response.ok) {
    throw new Error(`Failed to update item with ID ${id}`);
  }

  const data = await response.json();
  return data; 
};

const deleteItem = async (id: number) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete item with ID ${id}`);
  }

  return true; 
};

const ItemService = {
  getAllItems,
  getItemsByGroupId,
  createItem,
  getItemById,
  updateItem,
  deleteItem
};

export default ItemService;
