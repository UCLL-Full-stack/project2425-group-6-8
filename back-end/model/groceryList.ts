import { Item } from "./item";

export class GroceryList {
    private id?: number | undefined;
    private name: string;
    private items: Item[]; 
    private weight?: number | null;
    private quantity?: number | null;

    constructor(grocerylist: { id?: number; name: string; items: Item[]; weight?: number | null; quantity?: number | null }) {
        this.id = grocerylist.id;
        this.name = grocerylist.name;
        this.items = grocerylist.items;
        this.weight = grocerylist.weight || null;
        this.quantity = grocerylist.quantity || null;
    }

    getId(): number | undefined {
        return this.id;
    }

    getItems(): Item[] {
        return this.items;
    }
}