import { ConsumableType } from './consumableTypeEnum';

export class Item {
    private Id?: number | undefined;
    private description: string;
    private name: string;
    private consumableType: ConsumableType;
    private price: number;

       constructor(item: { Id?: number; description: string; name: string; consumableType: ConsumableType; price: number }) {
        this.Id = item.Id;
        this.description = item.description;
        this.name = item.name;
        this.consumableType = item.consumableType;
        this.price = item.price;
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
        return this.Id;
    }
}