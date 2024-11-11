import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';

const items: Item[] = [
    new Item({
        id: 1,
        name: 'Peanut Butter',
        description: 'Smooth peanut butter for sandwiches',
        consumableType: ConsumableType.Food,
        price: 4.99,
    }),
    new Item({
        id: 2,
        name: 'Bread',
        description: 'Whole grain bread',
        consumableType: ConsumableType.Food,
        price: 2.49,
    }),
    new Item({
        id: 3,
        name: 'Tomatoes',
        description: 'Fresh organic tomatoes',
        consumableType: ConsumableType.Food,
        price: 1.99,
    }),
    new Item({
        id: 4,
        name: 'Cucumber',
        description: 'Crisp cucumbers for salads',
        consumableType: ConsumableType.Food,
        price: 0.99,
    }),
];

const createItem = (item: Item): Item => {
    items.push(item);
    return item;
};

const getAllItems = (): Item[] => items;

const getItemById = (id: number): Item | null => {
    return items.find(item => item.getId() === id) || null;
};

export default { createItem, getAllItems, getItemById };
