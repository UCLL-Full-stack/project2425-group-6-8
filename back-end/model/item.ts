import { ConsumableType } from './consumableTypeEnum';

export class Item {
    private Id?: number | undefined;
    private name: string;
    private description: string;
    private consumableType: ConsumableType;
    private price: number;

       constructor(item: { Id?: number; name: string; description: string; consumableType: ConsumableType; price: number }) {
        this.validate(item);
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
    
    validate(item: { name: string; description: string; consumableType: ConsumableType; price: number }): void {
        if (!item.name?.trim()) {
            throw new Error('Item name is required');
        }
        if (!item.description?.trim()) {
            throw new Error('Item description is required');
        }
        if (!item.consumableType) {
            throw new Error('Consumable type is required');
        }
        if (item.price < 0) {
            throw new Error('Item must be higher than 0 mate, what do you think this is');
        }
    }
}