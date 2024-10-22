export class Item {
    description: string;
    name: string;
    consumableType: ConsumableType;
    price: number;

    constructor(description: string, name: string, consumableType: ConsumableType, price: number) {
        this.description = description;
        this.name = name;
        this.consumableType = consumableType;
        this.price = price;
    }
}