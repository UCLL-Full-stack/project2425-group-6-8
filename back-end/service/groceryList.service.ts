import { Item } from '../model';
import { GroceryList } from '../model/groceryList';
import groceryListDb from '../repository/groceryList.db';
import { ItemInput } from '../types';

let groceryLists: GroceryList[] = groceryListDb.getAllGroceryLists(); 


const getGroceryListById = (id: number): GroceryList | undefined => {
    return groceryLists.find(groceryList => groceryList.getId() === id); 
};

const getAllGroceryLists = (): GroceryList[] => {
    return groceryLists;
};

const addItemsToGroceryList = (groceryListId: number, items: ItemInput[]): GroceryList => {
    if (!groceryListId)
         throw new Error('Grocery list ID is required');

    const groceryList = groceryListDb.getGroceryListById(groceryListId);
    if (!groceryList)
         throw new Error('Grocery list not found');

    items.forEach(itemInput => {
        const item = new Item({
            id: itemInput.id,
            name: itemInput.name,
            description: itemInput.description,
            consumableType: itemInput.consumableType,
            price: itemInput.price,
        });

        groceryList.addItem(item);
    });

    return groceryList;
};

export default {
    getGroceryListById,
    getAllGroceryLists,
    addItemsToGroceryList
};
