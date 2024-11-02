import { ItemInput } from '../types';
import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';

const items: Item[] = [];
let itemIdCounter = 1;

const createItem = (itemData: ItemInput): Item => {
    if (!itemData.name || !itemData.description || !itemData.consumableType || itemData.price == null) {
        throw new Error('All item fields are required');
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
