import itemDb from '../repository/item.db';
import { ItemInput } from '../types';
import { Item } from '../model/item';

const createItem = async (itemInput: ItemInput): Promise<Item> => {
    const { name, description, consumableType, price, weight, quantity, isCompleted } = itemInput;

    if (!name?.trim()) throw new Error('Item name is required.');
    if (!description?.trim()) throw new Error('Item description is required.');
    if (!consumableType) throw new Error('Consumable type is required.');
    if (price === undefined || price < 0) throw new Error('Item price must be positive.');

    const item = new Item({ name, description, consumableType, price, weight, quantity,isCompleted });
    return await itemDb.createItem(item);
};

const getAllItems = async (): Promise<Item[]> => {
    return await itemDb.getAllItems();
};

const getItemById = async (id: number): Promise<Item | null> => {
    if (!id || id <= 0) throw new Error('Invalid ID.');
    return await itemDb.getItemById(id);
};

const deleteItem = async (id: number): Promise<boolean> => {
    if (!id || id <= 0) throw new Error('Invalid ID.');
    return await itemDb.deleteItem(id);
};

const updateItem = async (id: number, itemInput: ItemInput): Promise<Item | null> => {
    const { name, description, consumableType, price, weight, quantity, isCompleted } = itemInput;

    if (!id || id <= 0) throw new Error('Invalid ID.');
    if (!name?.trim()) throw new Error('Item name is required.');
    if (!description?.trim()) throw new Error('Item description is required.');
    if (!consumableType) throw new Error('Consumable type is required.');
    if (price === undefined || price < 0) throw new Error('Item price must be positive.');

    const updatedItem = new Item({ id, name, description, consumableType, price, weight, quantity, isCompleted });
    return await itemDb.updateItem(id, updatedItem);
};

const getItemsByGroupId = async (groupId: number): Promise<Item[]> => {
    if (!groupId || groupId <= 0) throw new Error('Invalid group ID.');

    try {
        const items = await itemDb.getItemsByGroupId(groupId);
        return items;
    } catch (error) {
        throw new Error('Error fetching items for group. See server log for details.');
    }
};


export default {
    createItem,
    getAllItems,
    getItemById,
    deleteItem,
    updateItem,
    getItemsByGroupId
};
