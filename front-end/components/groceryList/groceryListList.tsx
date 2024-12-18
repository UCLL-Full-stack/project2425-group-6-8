import React, { useEffect, useState } from "react";
import GroceryListService from "../../services/GroceryListService";

interface GroceryListProps {
  groupId: number;
}

const GroceryList: React.FC<GroceryListProps> = ({ groupId }) => {
  const [groceryLists, setGroceryLists] = useState<any | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [addedItems, setAddedItems] = useState<any[]>([]);
  const [removedItems, setRemovedItems] = useState<any[]>([]);

  const [editMode, setEditMode] = useState<number | null>(null);
  const [editableItem, setEditableItem] = useState<any>(null);

  useEffect(() => {
    const fetchGroceryLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const lists = await GroceryListService.getGroceryListsByGroupId(groupId);
        setGroceryLists(lists);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the grocery lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryLists();
  }, [groupId]);

  const handleEditClick = (groceryListId: number) => {
    setGroceryLists((prevLists: any[]) =>
      prevLists.map((list: any) =>
        list.id === groceryListId ? { ...list, editMode: !list.editMode } : list
      )
    );
  };

  const handleAddItem = (groceryListId: number) => {
    const itemName = prompt("Enter the item name:");
    if (itemName) {
      const newItem = { id: Date.now(), name: itemName }; 
      setGroceryLists((prevLists: any[]) =>
        prevLists.map((list: any) =>
          list.id === groceryListId
            ? {
                ...list,
                items: [...list.items, newItem],
              }
            : list
        )
      );
      setAddedItems((prevItems) => [...prevItems, newItem]); // Track added items
    }
  };

  // Delete an item from a grocery list
  const handleDeleteItem = (groceryListId: number, itemId: number) => {
    setGroceryLists((prevLists: any[]) =>
      prevLists.map((list: any) =>
        list.id === groceryListId
          ? {
              ...list,
              items: list.items.filter((item: any) => item.id !== itemId),
            }
          : list
      )
    );
    setRemovedItems((prevItems) => [...prevItems, itemId]); // Track removed items
  };

  // Save changes to the grocery list
  const handleSaveChanges = async (groceryListId: number, name: string) => {
    try {
      const addItemIds = addedItems.map((item) => item.id);
      const removeItemIds = removedItems;

      // Call the updateGroceryList service
      const updatedList = await GroceryListService.updateGroceryList(
        groceryListId,
        name,
        addItemIds,
        removeItemIds
      );

      // Optionally, update the local state with the updated list after saving
      setGroceryLists((prevLists: any[]) =>
        prevLists.map((list: any) =>
          list.id === groceryListId ? { ...list, ...updatedList } : list
        )
      );

      // Clear the added and removed items after saving
      setAddedItems([]);
      setRemovedItems([]);
      alert("Grocery list updated successfully!");
    } catch (error) {
      console.error("Error updating grocery list:", error);
      alert("Failed to save changes.");
    }
  };

  if (loading) return <div>Loading grocery lists...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {groceryLists?.length > 0 ? (
        groceryLists.map((groceryList: any) => (
          <div
            key={groceryList.id}
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h4 className="text-lg font-semibold">{groceryList.name}</h4>
            <ul className="divide-y divide-gray-300">
      {groceryList.items.map((item: any) => (
        <li key={item.id} className="py-2">
          <div className="flex justify-between items-center gap-4">
            <span className="font-medium text-gray-800">{item.name}</span>
            <span className="text-sm text-gray-600">{item.description}</span>
            <span className="text-sm text-gray-600">{item.consumableType}</span>
            <span className="text-sm text-gray-600">€{item.price.toFixed(2)}</span>
            <span className="text-sm text-gray-600">
              {item.weight ? `${item.weight} kg` : "N/A"}
            </span>
            <span className="text-sm text-gray-600">
              {item.quantity ? `Qty: ${item.quantity}` : "N/A"}
            </span>
          </div>
        </li>
      ))}
    </ul>
            {groceryList.editMode ? (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleAddItem(groceryList.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Add Item
                </button>
                <button
                  onClick={() => handleSaveChanges(groceryList.id, groceryList.name)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEditClick(groceryList.id)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No grocery lists in this group.</p>
      )}
    </div>
  );
};

export default GroceryList;
