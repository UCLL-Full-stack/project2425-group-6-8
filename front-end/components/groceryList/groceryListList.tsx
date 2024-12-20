import React, { useEffect, useState } from "react";
import GroceryListService from "../../services/GroceryListService";
import EditableItem from "../../components/item/ItemForm";
import AddItemModal from "../../components/item/AddItemModal";
import ItemService from "@services/ItemService";
import { Item } from "../../types";

type GroceryListProps = {
  groupId: number;
};

const GroceryList: React.FC<GroceryListProps> = ({ groupId }) => {
  const [groceryLists, setGroceryLists] = useState<any[] | null>(null);
  const [groupItems, setGroupItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<any[]>([]);
  const [removedItems, setRemovedItems] = useState<any[]>([]);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [currentGroceryListId, setCurrentGroceryListId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempGroceryLists, setTempGroceryLists] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchGroceryLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const lists = await GroceryListService.getGroceryListsByGroupId(groupId);
        setGroceryLists(lists);
        setTempGroceryLists(JSON.parse(JSON.stringify(lists)));
        const items = await ItemService.getItemsByGroupId(groupId);
        setGroupItems(items);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch grocery lists or group items.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryLists();
  }, [groupId]);

  const handleDeleteGroceryList = (groceryListId: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this grocery list? Items created will stay in the group."
    );

    if (isConfirmed) {
      GroceryListService.deleteGroceryList(groceryListId)
        .then(() => {
          setGroceryLists((prevLists: any[] | null) => {
            if (prevLists === null) {
              return []; // Return an empty array if prevLists is null
            }
            return prevLists.filter((list) => list.id !== groceryListId); // Filter out the deleted list
          });
          alert("Grocery list deleted successfully.");
        })
        .catch((error) => {
          console.error("Failed to delete grocery list:", error);
          alert("Failed to delete grocery list.");
        });
    }
  };

  const handleAddItem = (groceryListId: number) => {
    setCurrentGroceryListId(groceryListId);
    setShowAddItemModal(true);
  };

  const handleSaveChanges = async (groceryListId: number, name: string) => {
    if (groceryLists && groceryLists.length > 0) {
      const currentList = groceryLists.find((list) => list.id === groceryListId);
      if (currentList?.items.length === 0) {
        alert("You need to have at least one item in the list.");
        return;
      }
    }

    try {
      await Promise.all(
        editedItems.map((item) =>
          ItemService.updateItem(item.id, item)
        )
      );

      setEditedItems([]);

      const addItemIds = addedItems.map((item) => item.id);
      const removeItemIds = removedItems;

      const updatedList = await GroceryListService.updateGroceryList(
        groceryListId,
        name,
        addItemIds,
        removeItemIds
      );

      setGroceryLists((prevLists) => {
        if (prevLists === null) return [];
        return prevLists.map((list: any) => {
          if (list.id === groceryListId) {
            return {
              ...list,
              ...updatedList,
              items: list.items.map((item: any) =>
                editedItems.find((editedItem) => editedItem.id === item.id) || item
              )
            };
          }
          return list;
        });
      });

      alert("Changes saved successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };


  if (loading) return <div>Loading grocery lists...</div>;
  if (error) return <div>{error}</div>;

  return(
  <div className="flex flex-col h-screen overflow-hidden">
    <div className="flex-1 overflow-y-auto space-y-4 px-8 pb-40">
      {groceryLists && groceryLists.length > 0 ? (
        groceryLists.map((groceryList: any) => (
          <div
            key={groceryList.id}
            className={`p-4 shadow-md rounded-lg border min-h-[250px] flex flex-col transition-all duration-300 ${
              groceryList.items.every((item: { isCompleted: any }) => item.isCompleted)
                ? "bg-green-200 border-green-400"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              {editMode ? (
                <input
                  type="text"
                  value={groceryList.name}
                  onChange={(e) => (groceryList.name = e.target.value)}
                  className="text-lg font-semibold"
                />
              ) : (
                <h4 className="text-lg font-semibold">{groceryList.name}</h4>
              )}
              <div className="flex gap-2">
                {editMode && (
                  <button
                    onClick={() => handleAddItem(groceryList.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Add Item
                  </button>
                )}
                {editMode && (
                  <button
                    onClick={() => handleSaveChanges(groceryList.id, groceryList.name)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                )}
                <button
                  onClick={() => handleDeleteGroceryList(groceryList.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditMode((prev) => !prev)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {/* Scrollable items container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 mt-4 overflow-y-auto max-h-[300px]">
              {groceryList.items.map((item: any) => (
                <div key={item.id} className="p-4 bg-white shadow-md rounded-lg border">
                  <EditableItem
                    item={item}
                    onSave={(updatedItem: any) => {
                      setEditedItems((prev) => {
                        const itemIndex = prev.findIndex((i: any) => i.id === updatedItem.id);
                        if (itemIndex === -1) {
                          return [...prev, updatedItem];
                        }
                        const updatedEditedItems = [...prev];
                        updatedEditedItems[itemIndex] = updatedItem;
                        return updatedEditedItems;
                      });
                    }}
                  />
                  {editMode && (
                    <button
                      onClick={() => {
                        setRemovedItems((prev) => [...prev, item.id]);
                        setGroceryLists((prevLists: any[] | null) => {
                          if (prevLists === null) return [];
                          return prevLists.map((list: any) =>
                            list.id === groceryList.id
                              ? {
                                  ...list,
                                  items: list.items.filter((i: any) => i.id !== item.id),
                                }
                              : list
                          );
                        });
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg mt-2 w-full"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No grocery lists in this group.</p>
      )}
    </div>

    {showAddItemModal && currentGroceryListId && (
      <AddItemModal
        groupItems={groupItems}
        onAdd={(item) => {
          setGroceryLists((prevLists: any[] | null) => {
            if (prevLists === null) return [];
            return prevLists.map((list: any) =>
              list.id === currentGroceryListId
                ? { ...list, items: [...list.items, item] }
                : list
            );
          });
          setAddedItems((prevItems) => [...prevItems, item]);
        }}
        onClose={() => setShowAddItemModal(false)}
      />
    )}
  </div>
);

};

export default GroceryList;
