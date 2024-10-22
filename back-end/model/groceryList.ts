export class GroceryList {
    grocerylistid: number;
    itemid: number; 
    weight?: number | null;
    quantity?: number | null;

    constructor(grocerylistid: number, itemid: number, weight?: number | null, quantity?: number | null) {
        this.grocerylistid = grocerylistid;
        this.itemid = itemid;
        this.weight = weight || null;
        this.quantity = quantity || null;
    }
}