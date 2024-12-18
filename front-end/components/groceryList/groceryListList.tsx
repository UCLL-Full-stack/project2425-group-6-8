import React, { useEffect, useState } from "react";
import GroceryListService from "../../services/GroceryListService";

interface GroceryListProps {
  groupId: number;
}

const GroceryList: React.FC<GroceryListProps> = ({ groupId }) => {
  const [groceryLists, setGroceryLists] = useState<any | null>(null); // Array of grocery lists
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroceryLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const lists = await GroceryListService.getGroceryListsByGroupId(groupId);
        setGroceryLists(lists);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the grocery lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryLists();
  }, [groupId]);

  if (loading) return <div>Loading grocery lists...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {groceryLists?.length > 0 ? (
        groceryLists.map((groceryList: any) => (
          <div
            key={groceryList.id}
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h4 className="text-lg font-semibold">{groceryList.name}</h4>
            <ul>
              {groceryList.items.map((item: any) => (
                <li key={item.id} className="text-sm text-gray-700">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No grocery lists in this group.</p>
      )}
    </div>
  );
};

export default GroceryList;
