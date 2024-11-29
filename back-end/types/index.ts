import { ConsumableType } from '../model/consumableTypeEnum';

type Role = 'ApplicationAdmin' | 'user' | 'GroupAdmin';

type ScheduleInput = {
    id?: number;
    name: string;
    startDate: Date;
    endDate: Date;
};


type ItemInput = {
    id?: number;
    description: string;
    name: string;
    consumableType: ConsumableType;
    price: number;
    weight?: number;
    quantity?: number;
};

type UserInput = {
    id?: number;
    name?: string;
    email?: string;
    nickname: string;
    password: string;
    role?: Role;
};


type GroceryListInput = {
    name: string;
    id?: number;
    items: ItemInput[];

};

type MessageInput = {
    id?: number;
    user: UserInput;
    timestamp: Date;
    message: string;
};

type GroupInput = {
    name: string;
    id?: number;
    users: number[];
    groceryList?: GroceryListInput[];
    schedule?: ScheduleInput[];
    message?: MessageInput[];
};

type AuthenticationResponse = {
    token: string;
    nickname: string;
    name: string;
    role: string;
};

export {
    ScheduleInput,
    ItemInput,
    UserInput,
    GroceryListInput,
    MessageInput,
    GroupInput,
    AuthenticationResponse,
    Role
};
