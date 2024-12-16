import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MessageList from "../../components/messages/MessageList"; 
import MessageForm from "../../components/messages/MessageForm";

const GroupPage: React.FC = () => {
  const router = useRouter();
  const { groupId } = router.query;

  const [groupDetails, setGroupDetails] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupId) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:3000/group/${groupId}`);
          const data = await response.json();
          setGroupDetails(data);
        } catch (err) {
          setError("Failed to load group details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (loading) return <div>Loading group details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="group-page flex flex-col h-screen">
      <div className="flex-grow">
        <h1>{groupDetails?.name || "Group"}</h1>
        <MessageList groupId={Number(groupId)} />
      </div>

      <div className="absolute bottom-0 w-full p-4 bg-white shadow-lg">
        <MessageForm groupId={Number(groupId)} />
      </div>
    </div>
  );
};

export default GroupPage;
