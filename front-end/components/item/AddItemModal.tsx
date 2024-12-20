import React, { useState } from "react";
import { Item } from "../../types";
import { ConsumableType } from "../../types";
import ItemService from "@services/ItemService";

type AddItemModalProps = {
  groupItems: Item[];
  onAdd: (item: Item) => void;
  onClose: () => void;
};

const AddItemModal: React.FC<AddItemModalProps> = ({ groupItems, onAdd, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    name: "",
    description: "",
    consumableType: ConsumableType.Other, 
    price: 0,
    weight: 0,
    quantity: 0,
    isCompleted: false
  });

  const handleFieldChange = (field: keyof Item, value: any) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSubmit = async () => {
  try {
    console.log("Selected Item:", selectedItem);
    console.log("New Item:", newItem);

    if (selectedItem) {
      onAdd(selectedItem);
    } else {
      const existingItem = groupItems.find((item) => item.name === newItem.name);

      if (existingItem) {
        onAdd(existingItem);
      } else {
        const createdItem = await ItemService.createItem(newItem);
        onAdd(createdItem);
      }
    }

    onClose();
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Failed to add item.");
  }
};





  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add Item</h2>
        <label className="block font-semibold mb-2">Select Existing Item:</label>
        <select
          value={selectedItem?.id || ""}
          onChange={(e) =>
            setSelectedItem(
              groupItems.find((item) => item.id === parseInt(e.target.value)) || null
            )
          }
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select an Item --</option>
          {groupItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <hr className="my-4" />

        <h3 className="text-sm font-semibold mb-2">Or Create a New Item:</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <select
          value={newItem.consumableType}
          onChange={(e) => handleFieldChange("consumableType", e.target.value)}
          className="w-full border p-2 rounded mb-2"
        >
          {Object.values(ConsumableType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => handleFieldChange("price", parseFloat(e.target.value))}
          className="w-full border p-2 rounded mb-2"
        />
        <input
        type="number"
        placeholder="Quantity"
        value={newItem.quantity}
        onChange={(e) => handleFieldChange("quantity", parseFloat(e.target.value))}
        className="w-full border p-2 rounded mb-2"
        />
        <input
        type="number"
        placeholder="Weight"
        value={newItem.weight}
        onChange={(e) => handleFieldChange("weight", parseFloat(e.target.value))}
        className="w-full border p-2 rounded mb-2"
        />

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
