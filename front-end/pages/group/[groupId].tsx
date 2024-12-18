import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@components/header";
import GroupService from "../../services/GroupService";
import MessageList from "@components/messages/MessageList";
import MessageForm from "@components/messages/MessageForm";
import MessageService from "../../services/MessageService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch("http://localhost:3000/api/group");
  const groups = await res.json();

  return {
    props: {
      groups,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

const GroupDetails: React.FC = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("common");
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);

  // Retrieve logged-in user data
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (groupId !== null) {
        try {
          const fetchedMessages = await MessageService.getAllMessages(groupId);
          setMessages(fetchedMessages);
        } catch (err) {
          setError("Failed to load messages.");
          console.error(err);
        }
      }
    };
    fetchMessages();
  }, [groupId]);

  const handleNewMessage = (newMessages: any[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const handleLeaveGroup = async () => {
    if (!groupId || !loggedInUserData?.id) {
      setError("Unable to leave group.");
      return;
    }

    try {
      await GroupService.removeUserFromExistingGroup(groupId, loggedInUserData.id);
      alert("You have left the group successfully.");
      router.push("/group"); // Redirect to the groups page
    } catch (err) {
      console.error(err);
      setError("Failed to leave group.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Head>
        <title>{t("group.title")}</title>
      </Head>
      <Header />
      <div className="group-page flex flex-col h-auto relative max-w-5xl mx-auto">
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            onClick={handleLeaveGroup}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            Leave Group
          </button>
          <button
            onClick={() => setIsSliderOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            View Users
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform ${
            isSliderOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-900 to-green-500 text-white">
            <h3 className="text-gray-300">Group Users</h3>
            <button
              onClick={() => setIsSliderOpen(false)}
              className="text-white text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <div className="p-4 from-green-900 to-green-500">
            {groupDetails?.users && groupDetails.users.length > 0 ? (
              <ul>
                {groupDetails.users.map((user: any, index: number) => (
                  <li key={user.id || index} className="py-2 border-b border-gray-300">
                    <span className="font-semibold">{user.nickname}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users available</p>
            )}
          </div>
        </div>

        <div className="flex-grow p-1">
          <h1>{groupDetails?.name || "Group Details"}</h1>
          <h4 className="px-0 text-l font-semibold text-gray-800 dark:text-black text-center">
            Group Id: {groupDetails?.id || "error no id available"}
          </h4>
          <MessageList groupId={Number(groupId)} messages={messages} />
        </div>

        <div className="w-full p-4 bg-white shadow-lg mt-10">
          <MessageForm groupId={Number(groupId)} onMessageSent={handleNewMessage} />
        </div>
      </div>
    </>
  );
};

export default GroupDetails;
