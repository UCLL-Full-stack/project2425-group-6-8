// services/ItemService.ts
import { Item } from "@types";

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

// Create a new item (if needed for your app)
const createItem = async (item: Item) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + "/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUserData.token}`,
    },
    body: JSON.stringify(item),
  });
};



const ItemService = {
  getAllItems,
  createItem,
  getItemById
};

export default ItemService;
