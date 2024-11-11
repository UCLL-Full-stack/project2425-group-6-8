import { ConsumableType } from '../model/consumableTypeEnum';

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
};

type UserInput = {
    id?: number;
    name: string;
    email: string;
    nickname: string;
};


type GroceryListInput = {
    name: string;
    id?: number;
    items: ItemInput[];
    weight?: number | null;
    quantity?: number | null;
};

type MessageInput = {
    id?: number;
    user: UserInput;
    timestamp: string;
    message: string;
};

type GroupInput = {
    name: string;
    id?: number;
    users: UserInput[];
    groceryList?: GroceryListInput;
    schedule?: ScheduleInput;
    message?: MessageInput;
};

export {
    ScheduleInput,
    ItemInput,
    UserInput,
    GroceryListInput,
    MessageInput,
    GroupInput,
};
