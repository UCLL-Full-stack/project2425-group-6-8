import React, { useState } from "react";

type EditableItemProps = {
  item: any;
  onSave: (updatedItem: any) => void;
};

const EditableItem: React.FC<EditableItemProps> = ({ item, onSave }) => {
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    // Logic to save the edited item
    onSave(editedItem);
  };

  return (
    <div className="editable-item bg-white shadow-sm rounded-lg p-4 mb-4">
      <input
        type="text"
        value={editedItem.name}
        onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
        className="border border-gray-300 p-2 rounded-lg w-full"
      />
      <button
        onClick={handleSave}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
};

export default EditableItem;
