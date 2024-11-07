import { ConsumableType } from '../../back-end/model/consumableTypeEnum';

export type User = {
    name?: string;
    email?: string;
    nickname?: string;
};

export type Item = {
    Id?: number;
    description: string;
    name: string;
    consumableType: ConsumableType;
    price: number;
};

export type GroceryList = {
    name: string;
    id?: number;
    items: Item[];
    weight?: number | null;
    quantity?: number | null;
};

export type Group = {
    name?: string;
    users?: User[];
    groceryList?: GroceryList;
};
  