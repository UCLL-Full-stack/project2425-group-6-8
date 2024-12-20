import { GroceryList } from '../model/groceryList';
import groceryListRepository from '../repository/groceryList.db';
import itemRepository from '../repository/item.db';

const createGroceryList = async (
    name: string,
    itemIds: number[],
    groupId: number,
    
): Promise<GroceryList> => {
    console.log("Received itemIds:", itemIds);
    console.log("Type of itemIds:", typeof itemIds);

    if (!Array.isArray(itemIds)) {
        throw new Error("itemIds should be an array");
    }

    if (itemIds.length === 0) {
        throw new Error("itemIds array is empty");
    }

    for (const itemId of itemIds) {
        const item = await itemRepository.getItemById(itemId);
        if (!item) throw new Error(`Item with ID ${itemId} not found`);
    }

    return groceryListRepository.createGroceryList(name, itemIds, groupId);
};

const getGroceryListById = async (id: number): Promise<GroceryList | null> => {
    const groceryList = await groceryListRepository.getGroceryListById(id);
    if (!groceryList) throw new Error(`Grocery list with ID ${id} not found`);
    return groceryList;
};


const getGroceryListsByGroupId = async (groupId: number) => {
    return groceryListRepository.getGroceryListsByGroupId(groupId);
};



const getAllGroceryLists = async (): Promise<GroceryList[]> => {
    return await groceryListRepository.getAllGroceryLists();
};

const addItemsToGroceryList = async (
    groceryListId: number,
    itemIds: number[]
): Promise<GroceryList> => {
    const groceryList = await groceryListRepository.getGroceryListById(groceryListId);
    if (!groceryList) throw new Error(`Grocery list with ID ${groceryListId} not found`);

    for (const itemId of itemIds) {
        const item = await itemRepository.getItemById(itemId);
        if (!item) throw new Error(`Item with ID ${itemId} not found`);
    }

    return groceryListRepository.addItemsToGroceryList(groceryListId, itemIds);
};

const updateGroceryList = async (
    groceryListId: number,
    name?: string,
    addItemIds?: number[],
    removeItemIds?: number[]
): Promise<GroceryList> => {
    const groceryList = await groceryListRepository.getGroceryListById(groceryListId);
    if (!groceryList) throw new Error(`Grocery list with ID ${groceryListId} not found`);

    if (addItemIds) {
        for (const itemId of addItemIds) {
            const item = await itemRepository.getItemById(itemId);
            if (!item) throw new Error(`Item with ID ${itemId} not found`);
        }
    }

    return groceryListRepository.updateGroceryList(groceryListId, name, addItemIds, removeItemIds);
};

const deleteGroceryList = async (groceryListId: number): Promise<void> => {
    const groceryList = await groceryListRepository.getGroceryListById(groceryListId);
    if (!groceryList) throw new Error(`Grocery list with ID ${groceryListId} not found`);

    await groceryListRepository.deleteGroceryList(groceryListId);
};

export default {
    createGroceryList,
    getGroceryListById,
    getAllGroceryLists,
    addItemsToGroceryList,
    updateGroceryList, 
    deleteGroceryList, 
    getGroceryListsByGroupId,
    
};
