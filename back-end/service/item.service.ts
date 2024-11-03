import { ItemInput } from '../types';
import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';

const items: Item[] = [];
let itemIdCounter = 1;

const createItem = (itemData: ItemInput): Item => {
    if (!itemData.name?.trim()) {
        throw new Error('Item name is required');
    }
    if (!itemData.description?.trim()) {
        throw new Error('Item description is required');
    }
    if (!itemData.consumableType) {
        throw new Error('Consumable type is required');
    }
    if (itemData.price == null || itemData.price < 0) {
        throw new Error('Item price must be postive lil bro');
    }

    const newItem = new Item({
        Id: itemIdCounter++,
        description: itemData.description,
        name: itemData.name,
        consumableType: itemData.consumableType,
        price: itemData.price,
    });

    items.push(newItem);
    return newItem;
};


const getItemById = (id: number): Item | undefined => {
    return items.find(item => item.getId() === id);
};

const getAllItems = (): Item[] => {
    return items;
};

export default { createItem, getItemById, getAllItems };
