import { Item } from "./item";

export class GroceryList {
    private id?: number | undefined;
    private name: string;
    private items: Item[];
    private weight?: number | null;
    private quantity?: number | null;

    constructor(grocerylist: { id?: number; name: string; items: Item[]; weight?: number | null; quantity?: number | null }) {
        this.validate(grocerylist);

        this.id = grocerylist.id;
        this.name = grocerylist.name;
        this.items = grocerylist.items;
        this.weight = grocerylist.weight || null;
        this.quantity = grocerylist.quantity || null;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getItems(): Item[] {
        return this.items;
    }

     addItem(item: Item): void {
        this.items.push(item);
    }

    validate(grocerylist: { name: string; items: Item[] }) {
        if (!grocerylist.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!grocerylist.items || grocerylist.items.length === 0) {
            throw new Error('Grocery list must contain at least one item');
        }
    }

    equals(groceryList: GroceryList): boolean {
        return (
            this.name === groceryList.getName() &&
            this.items.length === groceryList.getItems().length &&
            this.items.every((item, index) => item === groceryList.getItems()[index]) &&
            this.weight === groceryList.weight &&
            this.quantity === groceryList.quantity
        );
    }
}
