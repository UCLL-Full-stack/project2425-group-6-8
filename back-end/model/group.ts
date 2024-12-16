import { User, GroceryList, Schedule, Message } from './index';
import {
    Group as GroupPrisma,
    User as UserPrisma,
    GroceryList as GroceryListPrisma,
    Schedule as SchedulePrisma,
    Message as MessagePrisma,
    Item as ItemPrisma,
} from '@prisma/client';

export class Group {
    private name: string;
    private id?: number | undefined;
    private users: User[];
    private groceryLists?: GroceryList[];
    private schedules?: Schedule[];
    private messages?: Message[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(group: { 
        name: string; 
        id?: number; 
        users: User[]; 
        groceryLists?: GroceryList[];
        schedules?: Schedule[]; 
        messages?: Message[]; 
        createdAt?: Date; 
        updatedAt?: Date; 
    }) {
        this.validate(group);

        this.name = group.name;
        this.id = group.id;
        this.users = group.users;
        this.groceryLists = group.groceryLists; 
        this.schedules = group.schedules;
        this.messages = group.messages;
        this.createdAt = group.createdAt;
        this.updatedAt = group.updatedAt;
    }

    getName(): string {
        return this.name;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsers(): User[] {
        return this.users;
    }

    getGroceryList(): GroceryList[] | undefined {
        return this.groceryLists;
    }

    getSchedule(): Schedule[] | undefined {
        return this.schedules;
    }

    getMessage(): Message[] | undefined {
        return this.messages;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    validate(group: { name: string; users?: User[] }) {
        if (!group.name?.trim()) {
            throw new Error('Group name is required');
        }
        if (!group.users || group.users.length === 0) {
            throw new Error('Group must contain at least one user');
        }
    }

   static from({
    id,
    name,
    users,
    groceryLists = [],
    schedules = [],
    messages = [],
    createdAt,
    updatedAt,
}: GroupPrisma & {
    users: UserPrisma[] | [];
    groceryLists?: GroceryListPrisma[];
    schedules?: SchedulePrisma[];
    messages?: MessagePrisma[];
}): Group {
    return new Group({
        id,
        name,
        users: users.map(User.from),
        groceryLists: groceryLists.map(GroceryList.from),
        schedules: schedules.map(Schedule.from),
        messages: messages.map(Message.from),
        createdAt,
        updatedAt,
    });
}

}
