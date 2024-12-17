import { GroceryList, Item } from "@types";


const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};




const GroceryListService = {

};

export default GroceryListService;