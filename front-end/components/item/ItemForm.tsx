import React, { useState } from "react";
import { Item, ConsumableType } from "../../types";

type EditableItemProps = {
  item: Item;
  onSave: (updatedItem: Item) => void;
};

const EditableItem: React.FC<EditableItemProps> = ({ item, onSave }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableItem, setEditableItem] = useState<Item>({ ...item });

  const handleFieldChange = (field: keyof Item, value: any) => {
    setEditableItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Call the parent's onSave to handle the database update
      onSave(editableItem);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setEditableItem({ ...item });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col p-4 border rounded shadow-md bg-white">
      {/* Name */}
      <div className="flex items-center">
        <label className="mr-2 font-semibold">Name:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableItem.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{item.name}</span>
        )}
      </div>

      {/* Description */}
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Description:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableItem.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{item.description}</span>
        )}
      </div>

      {/* Consumable Type */}
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Type:</label>
        {isEditing ? (
          <select
            value={editableItem.consumableType}
            onChange={(e) =>
              handleFieldChange("consumableType", e.target.value as ConsumableType)
            }
            className="border p-2 rounded"
          >
            {Object.values(ConsumableType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{item.consumableType}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Price:</label>
        {isEditing ? (
          <input
            type="number"
            value={editableItem.price}
            onChange={(e) => handleFieldChange("price", parseFloat(e.target.value))}
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>${item.price.toFixed(2)}</span>
        )}
      </div>

      {/* Weight */}
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Weight:</label>
        {isEditing ? (
          <input
            type="number"
            value={editableItem.weight ?? ""}
            onChange={(e) =>
              handleFieldChange("weight", e.target.value ? parseFloat(e.target.value) : undefined)
            }
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>
            {item.weight ? `${item.weight} kg` : "N/A"}
          </span>
        )}
      </div>

      {/* Quantity */}
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Quantity:</label>
        {isEditing ? (
          <input
            type="number"
            value={editableItem.quantity ?? ""}
            onChange={(e) =>
              handleFieldChange("quantity", e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>
            {item.quantity ?? "N/A"}
          </span>
        )}
      </div>

      {/* Save and Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};


export default EditableItem;
