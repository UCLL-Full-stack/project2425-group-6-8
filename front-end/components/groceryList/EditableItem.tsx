import React, { useState } from "react";

type EditableItemProps = {
  item: any;
  onSave: (updatedItem: any) => void;
};

const EditableItem: React.FC<EditableItemProps> = ({ item, onSave }) => {
  const [editedItem, setEditedItem] = useState(item);

  // Handle real-time updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItem = { ...editedItem, name: e.target.value };
    setEditedItem(updatedItem);
    onSave(updatedItem); // Immediate save when editing
  };

  const handleSave = () => {
    onSave(editedItem); // Ensure saving the item on button click
  };

  return (
    <div className="editable-item">
      <input
        type="text"
        value={editedItem.name}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <button onClick={handleSave} className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg">
        Save
      </button>
    </div>
  );
};

export default EditableItem;
