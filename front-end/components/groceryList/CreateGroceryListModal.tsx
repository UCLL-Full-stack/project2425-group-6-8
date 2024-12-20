import React, { useState } from "react";
import ItemService from "../../services/ItemService";
import GroceryListService from "../../services/GroceryListService";
import { Item } from "@types";
import AddItemModal from "../item/AddItemModal";
import useSWR from "swr";

const fetchItems = async () => {
  const response = await ItemService.getAllItems();
  return response;
};

const CreateGroceryListModal = ({
  groupId,
  onClose,
  onGroceryListCreated,
}: {
  groupId: number;
  onClose: () => void;
  onGroceryListCreated: (newGroceryList: any) => void;
}) => {
  const [name, setName] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [itemInputFields, setItemInputFields] = useState<number[]>([0]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const { data: availableItems = [], error } = useSWR("/items", fetchItems);

  if (error) {
    console.error("Error fetching items:", error);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleItemChange = (index: number, value: string) => {
    const itemId = parseInt(value, 10);
    if (!isNaN(itemId)) {
      const newSelectedItems = [...selectedItems];
      newSelectedItems[index] = itemId;
      setSelectedItems(newSelectedItems);
    }
  };

  const handleAddItemField = () => {
    setItemInputFields([...itemInputFields, itemInputFields.length]);
  };

  const handleRemoveItemField = (index: number) => {
    const newItemInputFields = itemInputFields.filter((_, idx) => idx !== index);
    setItemInputFields(newItemInputFields);
  };

  const handleCreateGroceryList = async () => {
    try {
      const newGroceryList = await GroceryListService.createGroceryList(name, selectedItems, groupId);
      onGroceryListCreated(newGroceryList);
      onClose();
    } catch (error) {
      console.error("Error creating grocery list:", error);
    }
  };

  const handleItemAdd = (newItem: Item) => {
  if (newItem.id != null) {
    setSelectedItems((prevSelectedItems) => {
      return [...prevSelectedItems, newItem.id].filter((item): item is number => item !== undefined);
    });
    setItemInputFields((prevItemInputFields) => [...prevItemInputFields, prevItemInputFields.length]);
    setIsAddItemModalOpen(false);
  } else {
    console.error("Invalid item ID: ", newItem);
    alert("Item ID is invalid.");
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Grocery List</h2>
        <input
          type="text"
          placeholder="Enter list name"
          value={name}
          onChange={handleNameChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {itemInputFields.map((_, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <select
              onChange={(e) => handleItemChange(index, e.target.value)}
              value={selectedItems[index] || ""}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Item</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleRemoveItemField(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between mb-4">
          <button
            type="button"
            onClick={handleAddItemField}
            className="text-green-500 hover:text-green-700"
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={() => setIsAddItemModalOpen(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            Create Item
          </button>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleCreateGroceryList}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {isAddItemModalOpen && (
        <AddItemModal
          onClose={() => setIsAddItemModalOpen(false)}
          groupItems={availableItems}
          onAdd={handleItemAdd}
        />
      )}
    </div>
  );
};

export default CreateGroceryListModal;
