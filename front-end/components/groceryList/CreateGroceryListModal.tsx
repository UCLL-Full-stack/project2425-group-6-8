import React, { useState, useEffect } from "react";
import ItemService from "../../services/ItemService";
import GroceryListService from "../../services/GroceryListService";
import { Item } from "@types";

// Modal component for creating a grocery list
const CreateGroceryListModal = ({ groupId, onClose }: { groupId: number; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [itemInputFields, setItemInputFields] = useState<number[]>([0]); // Start with one item input field

  useEffect(() => {
    // Fetch available items when the modal is opened
    const fetchItems = async () => {
      try {
        const data = await ItemService.getAllItems(); // Call ItemService to fetch items
        setAvailableItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

const handleItemChange = (index: number, value: string) => {
  const itemId = parseInt(value, 10);
  console.log("Selected value:", value, "Parsed itemId:", itemId); // Debug logs

  if (!isNaN(itemId)) {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = itemId;
    console.log("Updated selectedItems:", newSelectedItems); // Log the updated array
    setSelectedItems(newSelectedItems);
  } else {
    console.warn("Invalid itemId:", value); // Log invalid values
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
    console.log("Selected items:", selectedItems); // Debug log
    await GroceryListService.createGroceryList(name, selectedItems, groupId);
    onClose();
  } catch (error) {
    console.error("Error creating grocery list:", error);
  }
};


  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Grocery List</h2>
        <input
          type="text"
          placeholder="Enter list name"
          value={name}
          onChange={handleNameChange}
        />
        {itemInputFields.map((_, index) => (
          <div key={index} className="item-selection">
            <select
  onChange={(e) => handleItemChange(index, e.target.value)}
  value={selectedItems[index] || ""}
>
  <option value="">Select Item</option>
  {availableItems.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

            <button type="button" onClick={() => handleRemoveItemField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItemField}>
          +
        </button>
        <div>
          <button onClick={handleCreateGroceryList}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroceryListModal;
