import {Item } from "@types";


const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};

const createItem = (item: Item) => {
const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }
    return fetch (process.env.NEXT_PUBLIC_API_URL + "/item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${loggedInUserData.token}`,
        }
    })
}



const ItemService = {
    
};

export default ItemService;