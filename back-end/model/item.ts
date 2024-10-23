import { ConsumableType } from './consumableTypeEnum';

export class Item {
    private itemid: number;
    private description: string;
    private name: string;
    private consumableType: ConsumableType;
    private price: number;

    constructor(itemid: number, description: string, name: string, consumableType: ConsumableType, price: number) {
        this.itemid = itemid;
        this.description = description;
        this.name = name;
        this.consumableType = consumableType;
        this.price = price;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getConsumableType(): ConsumableType {
        return this.consumableType;
    }

    setConsumableType(consumableType: ConsumableType): void {
        this.consumableType = consumableType;
    }

    getPrice(): number {
        return this.price;
    }

    setPrice(price: number): void {
        this.price = price;
    }

    getId(): number | undefined {
        return this.itemid;
    }
}