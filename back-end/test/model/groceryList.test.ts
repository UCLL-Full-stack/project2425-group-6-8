import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";
import { ConsumableType } from "../../model/consumableTypeEnum";




test('given: valid values for a groceryList, when: groceryList is created, then: groceryList is created with those values', () => {
//given 
const item = new Item ({ 
    Id: 2,
    name: "Red Velvet Cake", 
    description: "Quite eligible and delicous",
    consumableType: ConsumableType.Food,
    price: 19.99
});

//when
const groceryList = new GroceryList({ item: item, quantity: 6 });

//then
expect(groceryList.getItem()).toEqual(item);

})