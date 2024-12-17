import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GroupService from "../../services/GroupService";
import MessageList from "@components/messages/MessageList";
import MessageForm from "@components/messages/MessageForm";

const GroupDetails: React.FC = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupDetails, setGroupDetails] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (router.query.groupId) {
      setGroupId(Number(router.query.groupId)); 
    }
  }, [router.query.groupId]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupId !== null) {
        setLoading(true);
        try {
          const group = await GroupService.getGroupById(groupId);
          setGroupDetails(group);
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
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="group-page flex flex-col h-screen">
      <div className="flex-grow">
        <h1>{groupDetails?.name || "Group Details"}</h1>
        <MessageList groupId={Number(groupId)} />
      </div>

      <div className="absolute bottom-0 w-full p-4 bg-white shadow-lg">
        <MessageForm groupId={Number(groupId)} />
      </div>
    </div>
  );
};

export default GroupDetails;
