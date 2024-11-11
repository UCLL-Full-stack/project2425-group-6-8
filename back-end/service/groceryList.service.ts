import { GroceryList } from '../model/groceryList';
import groceryListDb from '../repository/groceryList.db';
import itemDb from '../repository/item.db';

const getGroceryListById = (id: number): GroceryList | undefined => {
    return groceryListDb.getGroceryListById(id); 
};

const getAllGroceryLists = (): GroceryList[] => {
    return groceryListDb.getAllGroceryLists();
};

const addItemsToGroceryList = (groceryListId: number, itemIds: number[]): GroceryList => {
    const groceryList = groceryListDb.getGroceryListById(groceryListId);
    if (!groceryList) throw new Error('Grocery list not found');

    itemIds.forEach(itemId => {
        const item = itemDb.getItemById(itemId);
        console.log("ITEMS ARE: ", item )
        if (!item) throw new Error(`Item with ID ${itemId} not found`);
        groceryList.addItem(item); 
    });

    return groceryList;
};


export default {
    getGroceryListById,
    getAllGroceryLists,
    addItemsToGroceryList
};
