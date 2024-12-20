import React, { useState } from "react";
import EditableItem from "../../components/item/ItemForm";
import { Item } from "../../types";

type GroceryListItemProps = {
  groceryList: any;
  groupItems: Item[];
  setGroceryLists: React.Dispatch<React.SetStateAction<any[] | null>>; 
  setCurrentGroceryListId: React.Dispatch<React.SetStateAction<number | null>>;
};

const GroceryListItem: React.FC<GroceryListItemProps> = ({
  groceryList,
  groupItems,
  setGroceryLists,
  setCurrentGroceryListId,
}) => {
  const [editMode, setEditMode] = useState(false);

  const handleAddItem = (groceryListId: number) => {
    setCurrentGroceryListId(groceryListId);
    setEditMode(true);
  };

  const handleDeleteGroceryList = (groceryListId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this grocery list?");
    if (confirmed) {
      setGroceryLists((prevLists) => {
        if (!prevLists) return [];
        return prevLists.filter((list) => list.id !== groceryListId);
      });
    }
  };

 const handleSave = (updatedItem: Item) => {
  setGroceryLists((prevLists) => {
    if (!prevLists) return [];
    
    return prevLists.map((list) =>
      list.id === groceryList.id
        ? {
            ...list,
            items: list.items.map((i: Item) =>
              i.id === updatedItem.id ? updatedItem : i
            ),
          }
        : list
    );
  });
};

  return (
    <div className="grocery-list-item bg-white shadow-lg rounded-lg p-4 mb-4">
      <div className="header flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-800">{groceryList.name}</h4>
        <div className="actions space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => handleDeleteGroceryList(groceryList.id)}
          >
            Delete
          </button>
          {editMode && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => handleAddItem(groceryList.id)}
            >
              Add Item
            </button>
          )}
        </div>
      </div>

      <div className="items space-y-4">
        {groceryList.items.map((item: Item) => (
          <EditableItem
            key={item.id}
            item={item}
            onSave={handleSave} // Using the handleSave function to update items
          />
        ))}
      </div>
    </div>
  );
};

export default GroceryListItem;
