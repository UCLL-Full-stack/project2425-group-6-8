    import { ConsumableType } from './consumableTypeEnum';
    import { Item as ItemPrisma } from '@prisma/client';

    export class Item {
        private id?: number;
        private name: string;
        private description: string;
        private consumableType: ConsumableType;
        private price: number; 
        private weight?: number | null;  
        private quantity?: number | null;  

        constructor(item: { 
            id?: number; 
            name: string; 
            description: string; 
            consumableType: ConsumableType; 
            price: number;  
            weight?: number | null;  
            quantity?: number | null;  
        }) {
            this.validate(item);
            this.id = item.id;
            this.name = item.name;
            this.description = item.description;
            this.consumableType = item.consumableType;
            this.price = item.price;
            this.weight = item.weight;
            this.quantity = item.quantity;
        }

        getId(): number | undefined {
            return this.id;
        }

        getName(): string {
            return this.name;
        }

        setName(name: string): void {
            this.name = name;
        }

        getDescription(): string {
            return this.description;
        }

        setDescription(description: string): void {
            this.description = description;
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
            if (price < 0) {
                throw new Error('Price must be greater than or equal to 0.');
            }
            this.price = price;
        }

        getWeight(): number | null | undefined {
            return this.weight;
        }

        setWeight(weight: number | null): void {
            if (weight !== null && weight < 0) {
                throw new Error('Weight must be greater than or equal to 0.');
            }
            this.weight = weight;
        }

        getQuantity(): number | null | undefined {
            return this.quantity;
        }

        setQuantity(quantity: number | null): void {
            if (quantity !== null && quantity < 0) {
                throw new Error('Quantity must be greater than or equal to 0.');
            }
            this.quantity = quantity;
        }

        validate(item: { 
            name: string; 
            description: string; 
            consumableType: ConsumableType; 
            price: number;  
            weight?: number | null;  
            quantity?: number | null;
        }): void {
            if (!item.name?.trim()) {
                throw new Error('Item name is required.');
            }
            if (item.consumableType === undefined) {
                throw new Error('Consumable type is required.');
            }
            if (item.price < 0) {
                throw new Error('Price must be greater than or equal to 0.');
            }
        }   

        static from({ id, name, description, consumableType, price, weight, quantity }: ItemPrisma): Item {
            return new Item({
                id,
                name,
                description,
                consumableType: consumableType as ConsumableType,
                price,
                weight,
                quantity,
            });
        }
    }
