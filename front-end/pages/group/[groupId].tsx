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
import GroceryListService from "@services/GroceryListService";

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
  const [groupchat, setGroupchat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("common");
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = useState<boolean>(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);

  const [kickConfirmation, setKickConfirmation] = useState<{
    isOpen: boolean;
    userNickname: string | null;
    userId: number | null;
  }>({ isOpen: false, userNickname: null, userId: null });

  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  const isGroupAdmin = groupchat?.userGroups?.some(
    (ug: any) => ug.user.id === loggedInUserData?.id && ug.role === "GroupAdmin"
  );
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (router.query.groupId) setGroupId(Number(router.query.groupId));
  }, [router.query.groupId]);


  useEffect(() => {
    const fetchGroupchat = async () => {
      if (groupId !== null) {
        setLoading(true);
        try {
          const group = await GroupService.getGroupById(groupId);
          setGroupchat(group);
        } catch (err) {
          setError(t("general.error"));
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGroupchat();
  }, [groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (groupId !== null) {
        try {
          const fetchedMessages = await MessageService.getAllMessages(groupId);
          setMessages(fetchedMessages);
        } catch (err) {
          setError(t("general.error"));
          console.error(err);
        }
      }
    };
    fetchMessages();
    document.body.style.overflow = "hidden";
  }, [groupId]);

  const handleNewMessage = (newMessages: any[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const openKickConfirmation = (nickname: string, userId: number) => {
    setKickConfirmation({ isOpen: true, userNickname: nickname, userId });
  };

  const closeKickConfirmation = () => {
    setKickConfirmation({ isOpen: false, userNickname: null, userId: null });
  };

  const confirmKick = async () => {
    if (!groupId || !kickConfirmation.userId) return;

    try {
      await GroupService.removeUserFromExistingGroup(groupId, kickConfirmation.userId);
      const updatedGroup = await GroupService.getGroupById(groupId);
      setGroupchat(updatedGroup);
    } catch (err) {
      console.error(err);
    } finally {
      closeKickConfirmation();
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId || !loggedInUserData?.id) {
      setError(t("general.error"));
      return;
    }

    try {
      await GroupService.removeUserFromExistingGroup(groupId, loggedInUserData.id);
      router.push("/group");
    } catch (err) {
      console.error(err);
      setError(t("general.error"));
    }
  };

  if (loading) return <div>{t("general.loading")}</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Head>
        <title>{t("group.title")}</title>
      </Head>
      <Header className="sticky top-0 z-50 bg-white shadow-md" />
      <div className="group-page flex flex-col relative max-w-8xl mx-auto p-4">
        {/* Kick Confirmation Modal */}
        {kickConfirmation.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("group.kickConfirmation.title")}
              </h2>
              <p className="mt-2 text-gray-600">
                {t("group.kickConfirmation.text", { nickname: kickConfirmation.userNickname })}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeKickConfirmation}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  {t("group.kickConfirmation.cancel")}
                </button>
                <button
                  onClick={confirmKick}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  {t("group.kickConfirmation.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leave Confirmation Modal */}
        {leaveConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-800">{t("group.leave.title")}</h2>
              <p className="mt-2 text-gray-600">{t("group.leave.text")}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setLeaveConfirmation(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  {t("group.leave.cancel")}
                </button>
                <button
                  onClick={handleLeaveGroup}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  {t("group.leave.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-8 left-1 flex flex-row space-x-1">
          <button
            onClick={() => setLeaveConfirmation(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            {t("group.leave.button")}
          </button>
          <button
            onClick={() => setIsSliderOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            {t("group.viewUsers.button")}
          </button>

          {isGroupAdmin && (
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {t("group.createGroceryList.button")}
            </button>
          )}

          <button
            onClick={() => setIsGroceryListOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            {t("group.viewGroceryList.button")}
          </button>
        </div>
        {/* Sidebar for users */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform ${
            isSliderOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-900 to-green-500 text-white">
            <h3 className="text-gray-300">{t("users.title")}</h3>
            <button
              onClick={() => setIsSliderOpen(false)}
              className="text-white text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            {groupchat?.userGroups && groupchat.userGroups.length > 0 ? (
              <ul>
                {groupchat.userGroups.map((userGroup: any, index: number) => {
                  return (
                    <li
                      key={userGroup.user.id || index}
                      className="py-2 border-b border-gray-300 flex justify-between items-center"
                    >
                      <span>
                        <span className="font-semibold">{userGroup.user.nickname}</span>
                        <span className="text-gray-500 ml-2">({t(`group.role.${userGroup.role}`)})</span>
                      </span>
                      {isGroupAdmin &&
                        loggedInUserData?.id !== userGroup.user.id && (
                          <button
                            onClick={() =>
                              openKickConfirmation(userGroup.user.nickname, userGroup.user.id)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                          >
                            {t("group.kick")}
                          </button>
                        )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>{t("group.validate.noUsers")}</p>
            )}
          </div>
        </div>
        {/* Sidebar for grocery list */}
        <div
          className={`fixed top-0 right-0 h-full w-[40%] bg-gray-100 shadow-lg transform ${
            isGroceryListOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-500 to-green-900 text-white">
            <h3 className="text-lg font-semibold">{t("group.grocerylist")}</h3>
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

        <div className="flex-grow p-4 bg-gray-50 flex flex-col">
          <h1>{groupchat?.name || t("group.details.defaultName")}</h1>
          <h4 className="text-l font-semibold text-gray-800 dark:text-black text-center">
            {t("group.id")}: {groupchat?.id || t("group.details.noId")}
          </h4>
          {isModalOpen && (
            <CreateGroceryListModal groupId={Number(groupId)} onClose={handleCloseModal} />
          )}
          <div className="">
            <MessageList groupId={Number(groupId)} messages={messages} />
          </div>
        </div>

        <div className="sticky bottom-0 w-full bg-white shadow-lg p-4">
          <MessageForm groupId={Number(groupId)} onMessageSent={handleNewMessage} />
        </div>
      </div>
    </>
  );
};

export default groupchat;
