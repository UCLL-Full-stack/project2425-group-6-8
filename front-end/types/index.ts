import { ConsumableType } from './ConsumableType';

type Role = 'ApplicationAdmin' | 'user' | 'GroupAdmin';

export type User = {
    id?: number;
    name?: string;
    email?: string;
    nickname: string;
    password: string;
    role?: Role;
    globalRole?: Role;
};

export type Item = {
    id?: number;
    description: string;
    name: string;
    consumableType: ConsumableType;
    price: number;
    weight?: number;
    quantity?: number;
};

export type GroceryList = {
    name: string;
    id?: number;
    items: Item[];
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

export { ConsumableType };
  