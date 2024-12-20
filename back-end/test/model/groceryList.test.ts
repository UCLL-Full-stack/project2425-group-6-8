import { GroceryList } from '../../model/groceryList';
import { Item } from '../../model/item';
import { ConsumableType } from '../../model/consumableTypeEnum';

describe('GroceryList Tests', () => {
    test('given: invalid name, when: GroceryList is created, then: it throws an error', () => {
        // Given
        const groceryListData = {
            name: '',
            items: [],
        };

        // When / Then
        expect(() => {
            new GroceryList(groceryListData);
        }).toThrow('GroceryList name is required');
    });

    test('given: valid items, when: GroceryList is created, then: it is created with those items', () => {
        // Given
        const item = new Item({
            id: 1,
            name: 'Cake',
            description: 'A delicious cake',
            consumableType: ConsumableType.Food,
            price: 20,
            isCompleted: false,
        });

        const groceryListData = {
            name: 'Grocery List 1',
            items: [item],
        };

        // When
        const groceryList = new GroceryList(groceryListData);

        // Then
        expect(groceryList.getItems()).toEqual([item]);
    });

    test('given: invalid items (empty array), when: GroceryList is created, then: it throws an error', () => {
        // Given
        const groceryListData = {
            name: 'Grocery List 1',
            items: [],
        };

        // When / Then
        expect(() => {
            new GroceryList(groceryListData);
        }).toThrow('Grocery list must contain at least one item');
    });
});
