import { Item } from "./item";

export class GroceryList {
    private id?: number | undefined;
    private item: Item; // Changed from itemId to Item instance
    private weight?: number | null;
    private quantity?: number | null;

    constructor(grocerylist: { id?: number; item: Item; weight?: number | null; quantity?: number | null }) {
        this.id = grocerylist.id;
        this.item = grocerylist.item;
        this.weight = grocerylist.weight || null;
        this.quantity = grocerylist.quantity || null;
    }

    getId(): number | undefined {
        return this.id;
    }

    getItem(): Item {
        return this.item;
    }
}