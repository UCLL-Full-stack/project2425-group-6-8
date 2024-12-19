import { User, GroceryList, Schedule, Message } from './index';
import {
    Group as GroupPrisma,
    UserGroup as UserGroupPrisma,
    GroceryList as GroceryListPrisma,
    Schedule as SchedulePrisma,
} from '@prisma/client';

export class Group {
    private name: string;
    private id?: number | undefined;
    private userGroups: UserGroupPrisma[]; 
    private groceryLists?: GroceryList[];
    private schedules?: Schedule[];
    private messages?: Message[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(group: { 
        name: string; 
        id?: number; 
        userGroups: UserGroupPrisma[]; 
        groceryLists?: GroceryList[];
        schedules?: Schedule[]; 
        messages?: Message[]; 
        createdAt?: Date; 
        updatedAt?: Date; 
    }) {
        this.validate(group);

        this.name = group.name;
        this.id = group.id;
        this.userGroups = group.userGroups;
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

    getUserGroups(): UserGroupPrisma[] {
        return this.userGroups;
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

    validate(group: { name: string; userGroups?: UserGroupPrisma[] }) {
        if (!group.name?.trim()) {
            throw new Error('Group name is required');
        }
        if (!group.userGroups || group.userGroups.length === 0) {
            throw new Error('Group must contain at least one user');
        }
    }

    static from({
        id,
        name,
        userGroups,
        groceryLists = [],
        schedules = [],
        createdAt,
        updatedAt,
    }: GroupPrisma & {
        userGroups: UserGroupPrisma[];
        groceryLists?: GroceryListPrisma[];
        schedules?: SchedulePrisma[];
    }): Group {
        return new Group({
            id,
            name,
            userGroups,
            groceryLists: groceryLists.map(GroceryList.from),
            schedules: schedules.map(Schedule.from),
            createdAt,
            updatedAt,
        });
    }
}
