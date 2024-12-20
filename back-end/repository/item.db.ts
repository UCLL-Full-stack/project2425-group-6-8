import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';
import database from './database';
import { GroceryList as GroceryListPrisma, Item as ItemPrisma } from '@prisma/client';

Item.from = function ({
    id,
    name,
    description,
    consumableType,
    price,
    isCompleted
}: ItemPrisma): Item {
    const consumableTypeEnum = consumableType as ConsumableType;
    return new Item({
        id,
        name,
        description,
        consumableType: consumableTypeEnum,
        price,
        isCompleted
    });
};
//omd broooooo
const createItem = async (item: Item): Promise<Item> => {
    const itemPrisma = await database.item.create({
        data: {
            name: item.getName(),
            description: item.getDescription(),
            consumableType: item.getConsumableType(),
            price: item.getPrice(),
        },
    });
    return Item.from(itemPrisma);
};

const getAllItems = async (): Promise<Item[]> => {
    try {
        const itemsPrisma = await database.item.findMany();
        return itemsPrisma.map((itemPrisma) => Item.from(itemPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getItemById = async (id: number): Promise<Item | null> => {
    try {
        const itemPrisma = await database.item.findUnique({
            where: { id },
        });
        if (!itemPrisma) return null;
        return Item.from(itemPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const deleteItem = async (id: number): Promise<boolean> => {
    try {
        const item = await database.item.delete({
            where: { id },
        });
        return !!item;  
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete item. See server log for details');
    }
};

const updateItem = async (id: number, updatedItem: Item): Promise<Item | null> => {
    try {
        const updatedItemPrisma = await database.item.update({
            where: { id },
            data: {
                name: updatedItem.getName(),
                description: updatedItem.getDescription(),
                consumableType: updatedItem.getConsumableType(),
                price: updatedItem.getPrice(),
                isCompleted: updatedItem.getIsCompleted(),
            },
        });
        return Item.from(updatedItemPrisma);
    } catch (error) {
        console.error(error);
        console.log("Connected items are: " + updatedItem.getName)
        console.log("Price -velocity count: " + updatedItem.getPrice)
        throw new Error('Failed to update item. See server log for details');
    }
};

const getItemsByGroupId = async (groupId: number): Promise<Item[]> => {
    try {
        // Step 1: Fetch all grocery lists that belong to the given groupId, and include the related items
        const groceryLists = await database.groceryList.findMany({
            where: { groupId },
            include: {
                items: true,  
            },
        });


        let allItems: Item[] = [];
        groceryLists.forEach((groceryList) => {
            groceryList.items.forEach((itemPrisma) => {
                allItems.push(Item.from(itemPrisma));  
            });
        });

        return allItems;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch items for group. See server log for details');
    }
};


export default { createItem, getAllItems, getItemById, deleteItem, updateItem, getItemsByGroupId };
