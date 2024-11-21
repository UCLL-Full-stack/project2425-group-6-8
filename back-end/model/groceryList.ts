import { Item } from './item';
import {
    GroceryList as GroceryListPrisma,
    Item as ItemPrisma,
} from '@prisma/client';

export class GroceryList {
    private id?: number | undefined;
    private name: string;
    private items: Item[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(grocerylist: {
        id?: number;
        name: string;
        items: Item[];
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(grocerylist);

        this.id = grocerylist.id;
        this.name = grocerylist.name;
        this.items = grocerylist.items;
        this.createdAt = grocerylist.createdAt;
        this.updatedAt = grocerylist.updatedAt;
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

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    addItem(item: Item): void {
        this.items.push(item);
    }

    validate(grocerylist: { name: string; items: Item[] }): void {
        if (!grocerylist.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!grocerylist.items || grocerylist.items.length === 0) {
            throw new Error('Grocery list must contain at least one item');
        }
    }

    static from({
        id,
        name,
        items = [],
        createdAt,
        updatedAt,
    }: GroceryListPrisma & { items?: ItemPrisma[] }): GroceryList {
        return new GroceryList({
            id,
            name,
            items: items.map((item) => Item.from(item)),
            createdAt,
            updatedAt,
        });
    }
}
