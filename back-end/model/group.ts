import { User, GroceryList, Schedule, Message } from "./index";

export class Group {
    private name: string;
    private id?: number | undefined;
    private users?: User[];
    private groceryList?: GroceryList;
    private schedule?: Schedule;
    private message?: Message;

    constructor(group: { name: string; id?: number; users?: User[]; groceryList?: GroceryList; schedule?: Schedule; message?: Message }) {
        this.validate(group);

        this.name = group.name;
        this.id = group.id;
        this.users = group.users;
        this.groceryList = group.groceryList;
        this.schedule = group.schedule;
        this.message = group.message;
    }

    getName(): string {
        return this.name;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsers(): User[] | undefined {
        return this.users;
    }

    getGroceryList(): GroceryList | undefined {
        return this.groceryList;
    }

    getSchedule(): Schedule | undefined {
        return this.schedule;
    }

    getMessage(): Message | undefined {
        return this.message;
    }

    validate(group: { name: string; users?: User[] }) {
        if (!group.name?.trim()) {
            throw new Error('Group name is required');
        }
        if (!group.users || group.users.length === 0) {
            throw new Error('Group must contain at least one user');
        }
    }

}
