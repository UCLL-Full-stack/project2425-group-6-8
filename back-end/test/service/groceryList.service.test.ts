import groceryListService from '../../service/groceryList.service';
import { Item } from '../../model/item';
import { GroceryList } from '../../model/groceryList';
import { ItemInput, GroceryListInput } from '../../types';
import itemDb from '../../repository/item.db';
import groceryListDb from '../../repository/groceryList.db';
import { ConsumableType } from '../../model/consumableTypeEnum';

jest.mock('../../repository/item.db');
jest.mock('../../repository/groceryList.db');

const itemInput: ItemInput = {
    id: 1,
    name: 'Apples',
    quantity: 5,
    description: '',
    consumableType: ConsumableType.Food,
    price: 0,
    isCompleted: false
};

const item = new Item(itemInput);

const groceryListInput: GroceryListInput = {
  name: 'Shopping List',
  id: 1,
  items: [itemInput],
};

const groceryList = new GroceryList({
  ...groceryListInput,
  id: 1,
  items: [item],
});

let mockGetItemById: jest.Mock;
let mockCreateGroceryList: jest.Mock;

beforeEach(() => {
  mockGetItemById = jest.fn();
  mockCreateGroceryList = jest.fn();

  itemDb.getItemById = mockGetItemById;
  groceryListDb.createGroceryList = mockCreateGroceryList;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('given a valid grocery list, when the list is created, then the grocery list is created with those values', async () => {
  const itemIds = [itemInput.id]; 
  const groupId = 1;

  mockGetItemById.mockReturnValue(item);

  const validItemIds = itemIds.filter((id): id is number => id !== undefined); 

  await groceryListService.createGroceryList(groceryListInput.name, validItemIds, groupId);

  expect(mockGetItemById).toHaveBeenCalledTimes(1);
  expect(mockGetItemById).toHaveBeenCalledWith(itemInput.id);

  expect(mockCreateGroceryList).toHaveBeenCalledTimes(1);
  expect(mockCreateGroceryList).toHaveBeenCalledWith(expect.objectContaining({
    name: groceryListInput.name,
    items: expect.arrayContaining([expect.objectContaining({
      id: itemInput.id,
      name: itemInput.name,
      quantity: itemInput.quantity,
    })]),
  }));
});

test('given an invalid item ID, when trying to create a grocery list, then an error is thrown', async () => {
  mockGetItemById.mockResolvedValueOnce(null);

  const itemIds = [itemInput.id]; 
  const groupId = 1;

  const validItemIds = itemIds.filter((id): id is number => id !== undefined); 

  await expect(groceryListService.createGroceryList(groceryListInput.name, validItemIds, groupId))
    .rejects
    .toThrowError('Item not found');

  expect(mockCreateGroceryList).not.toHaveBeenCalled();
});

