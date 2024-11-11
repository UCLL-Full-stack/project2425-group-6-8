import { GroceryList } from '../model/groceryList';
import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';

// Predefined grocery lists
const groceryLists: GroceryList[] = [
    new GroceryList({
        id: 1,
        name: 'Weekly Grocery List',
        items: [
            (() => {
                const item = new Item({
                    id: 1,
                    name: 'Peanut Butter',
                    description: 'Smooth peanut butter for sandwiches',
                    consumableType: ConsumableType.Food,
                    price: 4.99,
                });
                return item;
            })(),
            (() => {
                const item = new Item({
                    id: 2,
                    name: 'Bread',
                    description: 'Whole grain bread',
                    consumableType: ConsumableType.Food,
                    price: 2.49,
                });
                return item;
            })(),
        ],
        weight: 3,
        quantity: 2,
    }),
    new GroceryList({
        id: 2,
        name: 'Vegetable Grocery List',
        items: [
            (() => {
                const item = new Item({
                    id: 3,
                    name: 'Tomatoes',
                    description: 'Fresh organic tomatoes',
                    consumableType: ConsumableType.Food,
                    price: 1.99,
                });
                return item;
            })(),
            (() => {
                const item = new Item({
                    id: 4,
                    name: 'Cucumber',
                    description: 'Crisp cucumbers for salads',
                    consumableType: ConsumableType.Food,
                    price: 0.99,
                });
                return item;
            })(),
        ],
        weight: 2,
        quantity: 2,
    }),
];

const createGroceryList = (groceryList: GroceryList): GroceryList => {
    groceryLists.push(groceryList);
    return groceryList;
};

const getGroceryListById = (id: number): GroceryList | undefined => {
    return groceryLists.find(groceryList => groceryList.getId() === id);
};

const getAllGroceryLists = (): GroceryList[] => groceryLists;

export default {
    getGroceryListById,
    getAllGroceryLists,
    createGroceryList,
};
