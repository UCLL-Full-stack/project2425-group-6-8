export class GroceryList {
    private grocerylistid: number;
    private itemid: number; 
    private weight?: number | null;
    private quantity?: number | null;

    constructor(grocerylistid: number, itemid: number, weight?: number | null, quantity?: number | null) {
        this.grocerylistid = grocerylistid;
        this.itemid = itemid;
        this.weight = weight || null;
        this.quantity = quantity || null;
    }

    getGrocerylistId(): number {
        return this.grocerylistid;
    }

    setGrocerylistId(grocerylistid: number): void {
        this.grocerylistid = grocerylistid;
    }

    getId(): number | undefined {
        return this.grocerylistid;
    }
}