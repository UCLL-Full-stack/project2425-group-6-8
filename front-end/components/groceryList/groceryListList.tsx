import React, { useEffect, useState } from "react";
import GroceryListService from "../../services/GroceryListService";

interface GroceryListProps {
  groupId: number;
}

const GroceryList: React.FC<GroceryListProps> = ({ groupId }) => {
  const [groceryList, setGroceryList] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroceryList = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await GroceryListService.getGroceryListById(groupId);
        setGroceryList(list);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the grocery list.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryList();
  }, [groupId]);

  if (loading) return <div>Loading grocery list...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Group Grocery List</h2>
      {groceryList?.items?.length > 0 ? (
        <ul>
          {groceryList.items.map((item: any) => (
            <li key={item.id} className="py-2 border-b">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this grocery list.</p>
      )}
    </div>
  );
};

export default GroceryList;
