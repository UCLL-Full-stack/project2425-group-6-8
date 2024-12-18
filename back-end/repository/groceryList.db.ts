import { GroceryList as GroceryListPrisma, Item as ItemPrisma } from '@prisma/client';
import { GroceryList } from '../model/groceryList';
import { Item } from '../model/item';
import database from './database';

GroceryList.from = function ({
    id,
    name,
    items = [],
    createdAt,
    updatedAt,
}: GroceryListPrisma & { items?: ItemPrisma[] }): GroceryList {
    return new GroceryList({
        id,
        name,
        items: items.map((item) => Item.from(item)),
        createdAt,
        updatedAt,
    });
};

const createGroceryList = async (
    name: string,
    groupId: number,
    itemIds: number[]
): Promise<GroceryList> => {
    try {
        const groceryListPrisma = await database.groceryList.create({
            data: {
                name,
                groupId,
                items: {
                    connect: itemIds.map((itemId) => ({ id: itemId })),
                },
            },
            include: { items: true },
        });

        return GroceryList.from(groceryListPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};


const getGroceryListById = async (id: number): Promise<GroceryList | null> => {
    try {
        const groceryListPrisma = await database.groceryList.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!groceryListPrisma) return null;
        return GroceryList.from(groceryListPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};



const getAllGroceryLists = async (): Promise<GroceryList[]> => {
    try {
        const groceryListsPrisma = await database.groceryList.findMany({
            include: { items: true },
        });
        return groceryListsPrisma.map((groceryList) => GroceryList.from(groceryList));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const updateGroceryList = async (
    groceryListId: number,
    name?: string,
    addItemIds?: number[],
    removeItemIds?: number[]
): Promise<GroceryList> => {
    try {
        const updatedGroceryListPrisma = await database.groceryList.update({
            where: { id: groceryListId },
            data: {
                ...(name && { name }), 
                items: {
                    ...(addItemIds && {
                        connect: addItemIds.map((itemId) => ({ id: itemId })),
                    }),
                    ...(removeItemIds && {
                        disconnect: removeItemIds.map((itemId) => ({ id: itemId })),
                    }),
                },
            },
            include: { items: true },
        });

        return GroceryList.from(updatedGroceryListPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};


const addItemsToGroceryList = async (groceryListId: number, itemIds: number[]): Promise<GroceryList> => {
    try {
        const updatedGroceryListPrisma = await database.groceryList.update({
            where: { id: groceryListId },
            data: {
                items: {
                    connect: itemIds.map((itemId) => ({ id: itemId })),
                },
            },
            include: { items: true },
        });

        return GroceryList.from(updatedGroceryListPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const deleteGroceryList = async (groceryListId: number): Promise<void> => {
    try {
        await database.groceryList.delete({
            where: { id: groceryListId },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};


export default {
    createGroceryList,
    getGroceryListById,
    getAllGroceryLists,
    addItemsToGroceryList,
    updateGroceryList, 
    deleteGroceryList, 
};

