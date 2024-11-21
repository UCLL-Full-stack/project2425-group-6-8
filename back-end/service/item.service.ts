import itemDb from '../repository/item.db';
import { ItemInput } from '../types';
import { Item } from '../model/item';

const createItem = async (itemInput: ItemInput): Promise<Item> => {
    const { name, description, consumableType, price, weight, quantity } = itemInput;

    if (!name?.trim()) throw new Error('Item name is required.');
    if (!description?.trim()) throw new Error('Item description is required.');
    if (!consumableType) throw new Error('Consumable type is required.');
    if (price === undefined || price < 0) throw new Error('Item price must be positive.');

    const item = new Item({ name, description, consumableType, price, weight, quantity });
    return await itemDb.createItem(item);
};

const getAllItems = async (): Promise<Item[]> => {
    return await itemDb.getAllItems();
};

const getItemById = async (id: number): Promise<Item | null> => {
    if (!id || id <= 0) throw new Error('Invalid ID.');
    return await itemDb.getItemById(id);
};

export default {
    createItem,
    getAllItems,
    getItemById,
};
