import { Item } from '../../model/item';
import { ConsumableType } from '../../model/consumableTypeEnum';

describe('Item Tests', () => {
    test('given: invalid name (empty), when: Item is created, then: it throws an error', () => {
        // Given
        const itemData = {
            name: '',
            description: 'A delicious cake',
            consumableType: ConsumableType.Food,
            price: 20,
            isCompleted: false,
        };

        // When / Then
        expect(() => {
            new Item(itemData);
        }).toThrow('Item name is required.');
    });

    test('given: invalid price, when: Item is created, then: it throws an error', () => {
        // Given
        const itemData = {
            name: 'Cake',
            description: 'A delicious cake',
            consumableType: ConsumableType.Food,
            price: -1,
            isCompleted: false,
        };

        // When / Then
        expect(() => {
            new Item(itemData);
        }).toThrow('Price must be greater than or equal to 0.');
    });

    test('given: invalid consumableType (undefined), when: Item is created, then: it throws an error', () => {
        // Given
        const itemData = {
            name: 'Cake',
            description: 'A delicious cake',
            consumableType: undefined as any,
            price: 20,
            isCompleted: false,
        };

        // When / Then
        expect(() => {
            new Item(itemData);
        }).toThrow('Consumable type is required.');
    });
});
