import React, { useState } from "react";
import { Item, ConsumableType } from "../../types";
import ItemService from "@services/ItemService";

type EditableItemProps = {
  item: Item;
  onSave: (updatedItem: Item) => void;
};

const EditableItem: React.FC<EditableItemProps> = ({ item, onSave }) => {
 const [isEditing, setIsEditing] = useState<boolean>(false);
const [editableItem, setEditableItem] = useState<Item>({ ...item });
const [itemDetailsVisible, setItemDetailsVisible] = useState<boolean>(false);

const handleFieldChange = (field: keyof Item, value: any) => {
  // Ensure editableItem is never undefined
  setEditableItem((prev) => {
    if (!prev) return prev; // If prev is undefined, return it as is.
    return {
      ...prev,
      [field]: value ?? (field === "weight" || field === "quantity" || field === "price" ? 0 : value),
    };
  });
};

const handleSave = async () => {
  try {
    if (editableItem) {
      onSave(editableItem); // Propagate changes upwards
      setIsEditing(false); // Stop editing
    }
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const newCheckedValue = e.target.checked;
  console.log("Checkbox checked:", newCheckedValue);  // Debugging log
  handleFieldChange("isCompleted", newCheckedValue);

  // Logging editableItem before sending it to the server 
  console.log("Editable item before sending to the server:", editableItem); 

  try {
    if (editableItem) {
      await ItemService.updateItem(editableItem.id, {
        ...editableItem,
        isCompleted: newCheckedValue,
      });
      console.log("Item updated successfully");
    }
  } catch (error) {
    console.error("Error updating item:", error);
  }
};




  const handleCancel = () => {
    setEditableItem({ ...item });
    setIsEditing(false);
  };

  const toggleItemDetails = () => {
    setItemDetailsVisible((prev) => !prev);
  };

  return (
    <div
      className={`relative flex flex-col p-4 border rounded shadow-md bg-white transition-all duration-300 ${
        itemDetailsVisible ? "min-h-[20rem]" : "min-h-[10rem]"
      }`}
    >
      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Completed:</label>
        <input
          type="checkbox"
          checked={editableItem.isCompleted}
          onChange={handleCheckboxChange}
          className="w-5 h-5"
        />
      </div>

      <button
        type="button"
        onClick={toggleItemDetails}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        title={itemDetailsVisible ? "Hide Details" : "Show Details"}
      >
        {itemDetailsVisible ? "-" : "+"}
      </button>

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

      <div className="flex items-center mt-2">
        <label className="mr-2 font-semibold">Price:</label>
        {isEditing ? (
          <input
            type="number"
            value={editableItem.price ?? 0}
            onChange={(e) =>
              handleFieldChange("price", e.target.value ? parseFloat(e.target.value) : 0)
            }
            className="border p-2 rounded"
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>€{item.price.toFixed(2)}</span>
        )}
      </div>

      {itemDetailsVisible && (
        <div className="mt-4 space-y-2">
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

          <div className="flex items-center">
            <label className="mr-2 font-semibold">Weight:</label>
            {isEditing ? (
              <input
                type="number"
                value={editableItem.weight ?? 0}
                onChange={(e) =>
                  handleFieldChange("weight", e.target.value ? parseFloat(e.target.value) : 0)
                }
                className="border p-2 rounded"
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)}>
                {item.weight ? `${item.weight} kg` : "N/A"}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <label className="mr-2 font-semibold">Quantity:</label>
            {isEditing ? (
              <input
                type="number"
                value={editableItem.quantity ?? 0} // Set to 0 if undefined
                onChange={(e) =>
                  handleFieldChange("quantity", e.target.value ? parseInt(e.target.value) : 0)
                }
                className="border p-2 rounded"
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)}>
                {item.quantity ?? "N/A"}
              </span>
            )}
          </div>
        </div>
      )}

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
