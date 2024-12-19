import { Item } from "@types";

// Helper function to get logged-in user data from localStorage
const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};

// Fetch all items
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
  return data; // Assuming response is an array of items
};

// Fetch items by groupId
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
  return data; // Assuming response is an array of items for the specific group
};

// Fetch a single item by ID
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
  return data; // Assuming response is a single item
};

// Create a new item
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

  // Extract the response body as JSON
  const data = await response.json();
  
  return data; // Return the created item (which should include the `id`)
};


// Update an item by ID
const updateItem = async (id: number, updatedItem: Item) => {
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
  return data; // Assuming the updated item is returned
};

// Delete an item by ID
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

  return true; // Item deleted successfully
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
