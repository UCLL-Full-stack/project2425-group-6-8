import { Item } from '../model/item';
import { ConsumableType } from '../model/consumableTypeEnum';
import database from './database';
import { Item as ItemPrisma } from '@prisma/client';

Item.from = function ({
    id,
    name,
    description,
    consumableType,
    price
}: ItemPrisma): Item {
    const consumableTypeEnum = consumableType as ConsumableType;
    return new Item({
        id,
        name,
        description,
        consumableType: consumableTypeEnum,  
        price
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

export default { createItem, getAllItems, getItemById };
