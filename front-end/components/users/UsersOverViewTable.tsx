import { useEffect, useState } from "react";
import UserService from "services/UserService";
import { User } from "@types";

const UsersOverviewTable: React.FC = () => {
  const [retrievedUsers, setUsers] = useState<User[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await UserService.getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Users Overview</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nickname</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {retrievedUsers && retrievedUsers.length > 0 ? (
              retrievedUsers.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.nickname}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.globalRole || "user"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersOverviewTable;
