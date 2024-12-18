import { ConsumableType } from '../../back-end/model/consumableTypeEnum';

type Role = 'ApplicationAdmin' | 'user' | 'GroupAdmin';

export type User = {
    id?: number;
    name?: string;
    email?: string;
    nickname: string;
    password: string;
    role?: Role;
};

export type Item = {
    id?: number;
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

export type Message = {
    id?: number;
    user: User;
    timestamp: Date;
    message: string;
};

export type Group = {
    id?: number;
    name?: string;
    users?: User[];
    groceryList?: GroceryList;
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};
  