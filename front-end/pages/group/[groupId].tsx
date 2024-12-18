import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@components/header";
import GroupService from "../../services/GroupService";
import MessageList from "@components/messages/MessageList";
import MessageForm from "@components/messages/MessageForm";
import GroceryList from "@components/groceryList/groceryListList";
import MessageService from "../../services/MessageService";
import CreateGroceryListModal from "../../components/groceryList/CreateGroceryListModal";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next"; 

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch("http://localhost:3000/group");
  const groups = await res.json();

  return {
    props: {
      groups,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

const groupchat: React.FC = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupchat, setgroupchat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false); 
  const [isGroceryListOpen, setIsGroceryListOpen] = useState<boolean>(false); 

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (router.query.groupId) {
      setGroupId(Number(router.query.groupId));
    }
  }, [router.query.groupId]);

  useEffect(() => {
    const fetchgroupchat = async () => {
      if (groupId !== null) {
        setLoading(true);
        try {
          const group = await GroupService.getGroupById(groupId);
          setgroupchat(group);
        } catch (err) {
          setError("Failed to load group details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchgroupchat();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Head>
        <title>{t("group.title")}</title>
      </Head>
      <Header />
      <div className="group-page flex flex-col h-screen relative">
        {/* Group Users Button */}
        <button
          onClick={() => setIsSliderOpen(true)}
          className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          View Users
        </button>

        {/* Grocery List Button */}
        <button
          onClick={() => setIsGroceryListOpen(true)}
          className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
          View Grocery List
        </button>

        {/* Group Users Sliding Panel */}
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
            {groupchat?.users && groupchat.users.length > 0 ? (
              <ul>
                {groupchat.users.map((user: any, index: number) => (
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

        {/* Grocery List Sliding Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-[40%] bg-gray-100 shadow-lg transform ${
              isGroceryListOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-50`}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-500 to-green-900 text-white">
              <h3 className="text-lg font-semibold">Grocery List</h3>
              <button
                onClick={() => setIsGroceryListOpen(false)}
                className="text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-4">
              {groupId && <GroceryList groupId={groupId} />}
            </div>
          </div>

        {/* Main Content */}
        <div className="flex-grow">
          <h1>{groupchat?.name || "Group Details"}</h1>
          <h4 className="px-0 text-l font-semibold text-gray-800 dark:text-black text-center">
            Group Id: {groupchat?.id || "error no id available"}
          </h4>
           <button onClick={handleOpenModal}>Create Grocery List</button>
              {isModalOpen && (
                <CreateGroceryListModal groupId={Number(groupId)} onClose={handleCloseModal} />
              )}
          <div className="flex-grow overflow-y-auto px-4 py-2 bg-gray-50">
            <MessageList groupId={Number(groupId)} messages={messages} />
            
          </div>
        </div>

        {/* Message Form */}
         <div className="sticky bottom-0 w-full bg-white shadow-lg p-4">
          < MessageForm groupId={Number(groupId)} onMessageSent={handleNewMessage} />
        </div>
      </div>
    </>
  );
};

export default groupchat;
