import { GroceryList } from '../model/groceryList';
import groceryListRepository from '../repository/groceryList.db';
import itemRepository from '../repository/item.db';

const createGroceryList = async (name: string, itemIds: number[]): Promise<GroceryList> => {
    for (const itemId of itemIds) {
        const item = await itemRepository.getItemById(itemId);
        if (!item) throw new Error(`Item with ID ${itemId} not found`);
    }

    return groceryListRepository.createGroceryList(name, itemIds);
};

const getGroceryListById = async (id: number): Promise<GroceryList | null> => {
    const groceryList = await groceryListRepository.getGroceryListById(id);
    if (!groceryList) throw new Error(`Grocery list with ID ${id} not found`);
    return groceryList;
};

const getAllGroceryLists = async (): Promise<GroceryList[]> => {
    return await groceryListRepository.getAllGroceryLists();
};

const addItemsToGroceryList = async (groceryListId: number, itemIds: number[]): Promise<GroceryList> => {
    const groceryList = await groceryListRepository.getGroceryListById(groceryListId);
    if (!groceryList) throw new Error(`Grocery list with ID ${groceryListId} not found`);

    for (const itemId of itemIds) {
        const item = await itemRepository.getItemById(itemId);
        if (!item) throw new Error(`Item with ID ${itemId} not found`);
    }

    return groceryListRepository.addItemsToGroceryList(groceryListId, itemIds);
};

export default {
    createGroceryList,
    getGroceryListById,
    getAllGroceryLists,
    addItemsToGroceryList,
};
