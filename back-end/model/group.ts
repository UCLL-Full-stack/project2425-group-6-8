import { User, GroceryList, Schedule, Message } from "./index";

export class Group {
    private name: string;
    private id?: number | undefined;
    private user: User; 
    private groceryList?: GroceryList; 
    private schedule?: Schedule; 
    private message?: Message; 

    constructor(group: { name: string; id?: number; user: User; groceryList?: GroceryList; schedule?: Schedule; message?: Message }) {
        this.name = group.name;
        this.id = group.id;
        this.user = group.user;
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

    getUser(): User {
        return this.user;
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
}