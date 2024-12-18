import { GroceryList, Item } from "@types";

const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};

const BASE_URL = "http://localhost:3000/grocerylists";

const GroceryListService = {
  async getAllGroceryLists(): Promise<GroceryList[]> {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch grocery lists.");
    }

    return response.json();
  },

  async getGroceryListsByGroupId(groupId: number): Promise<GroceryList[]> {
    const response = await fetch(`${BASE_URL}/group/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch grocery lists for the group.");
    }

    return response.json();
  },

  async getGroceryListById(id: number): Promise<GroceryList> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Grocery list not found.");
      }
      throw new Error("Failed to fetch grocery list.");
    }

    return response.json();
  },

  async createGroceryList(name: string, itemIds: number[], groupId: number): Promise<GroceryList> {
    const requestBody = { name, groupId, items: itemIds };
    console.log("Request body being sent:", requestBody); 

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to create grocery list.");
    }

    return response.json();
  },


  async updateGroceryList(id: number, name: string, addItemIds: number[], removeItemIds: number[]): Promise<GroceryList> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
      body: JSON.stringify({
        name,
        addItemIds,
        removeItemIds,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update grocery list.");
    }

    return response.json();
  },

  async deleteGroceryList(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete grocery list.");
    }
  },

  async addItemsToGroceryList(id: number, itemIds: number[]): Promise<GroceryList> {
    const response = await fetch(`${BASE_URL}/${id}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getLoggedInUserData()?.token}`,
      },
      body: JSON.stringify({ itemIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to add items to the grocery list.");
    }

    return response.json();
  },
};

export default GroceryListService;
