import { User } from '../model';
import { GroceryList } from '../model/groceryList';
import { GroceryListInput } from '../types'; 
import { Item } from '../model/item'; 

let groceryLists: GroceryList[] = []; 
let idCounter = 1; 

const addGroceryList = (groceryListData: GroceryListInput): GroceryList => {
    if (!groceryListData.name?.trim()) {
        throw new Error('Grocery list name is required');
    }
    if (!groceryListData.items || groceryListData.items.length === 0) {
        throw new Error('At least one item is required in the grocery list');
    }

    const items: Item[] = groceryListData.items.map(itemInput => {
        return new Item(itemInput); 
    });

    const groceryList = new GroceryList({ 
        id: idCounter++,
        name: groceryListData.name,
        items: items, 
    });

    groceryLists.push(groceryList);
    return groceryList;
};


const getGroceryListById = (id: number): GroceryList | undefined => {
    return groceryLists.find(groceryList => groceryList.getId() === id); 
};

const getAllGroceryLists = (): GroceryList[] => {
    return groceryLists;
};

export default {
    addGroceryList,
    getGroceryListById,
    getAllGroceryLists,
};
