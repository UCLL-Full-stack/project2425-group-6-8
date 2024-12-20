import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@components/header";
import GroupService from "../../services/GroupService";
import MessageService from "../../services/MessageService";
import useSWR from "swr"; // Import useSWR
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import GroupActions from "@components/group/GroupActions";
import GroupDetails from "@components/group/GroupDetails";
import UserListSidebar from "@components/group/UserListSidebar";
import GroceryListSidebar from "@components/group/GroceryListSidebar";
import KickConfirmationModal from "@components/group/KickConfirmationModal";
import LeaveConfirmationModal from "@components/group/LeaveConfirmationModal";
import MessageSection from "@components/messages/MessageSection";

// Fetcher function for SWR, including token in headers
const fetcher = (url: string) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const token = loggedInUser?.token;
  console.log("Fetcher called with token:", token);

  return fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error during fetch:", err);
      return null;
    });
};

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

const Groupchat: React.FC = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient) {
      const { groupId } = router.query;
      if (groupId) {
        setGroupId(Number(groupId));  
      }
    }
  }, [router.query, isClient]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);
  const [kickConfirmation, setKickConfirmation] = useState<{
    isOpen: boolean;
    userNickname: string | null;
    userId: number | null;
  }>({ isOpen: false, userNickname: null, userId: null });

  const { t } = useTranslation("common");

  const loggedInUserData = (() => {
    if (typeof window === "undefined") {
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  const token = loggedInUserData?.token;

  const { data: groupchat, error: groupError } = useSWR(
    groupId ? `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}` : null,
    fetcher
  );

  const { data: messages, error: messagesError } = useSWR(
    groupId ? `${process.env.NEXT_PUBLIC_API_URL}/messages?groupId=${groupId}` : null,
    fetcher
  );

  if (groupError || messagesError) {
    return <div>Failed to load data</div>;
  }

  if (!groupchat || !messages) {
    return <div>Loading...</div>;
  }

  const handleLeaveGroup = async () => {
    if (!groupId || !loggedInUserData?.id) return;
    await GroupService.removeUserFromExistingGroup(groupId, loggedInUserData.id);
    router.push("/group");
  };

  const handleDeleteGroup = async () => {
    if (!groupId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (confirmDelete) {
      await GroupService.deleteGroup(groupId);
      router.push("/group");
    }
  };

  const isGroupAdmin = groupchat?.userGroups?.some(
    (ug: any) => ug.user.id === loggedInUserData?.id && ug.role === "GroupAdmin"
  );

  return (
    <>
      <Head>
        <title>{t("group.title")}</title>
      </Head>
      <Header className="sticky top-0 z-50 bg-white shadow-md" />
      <GroupActions
        isGroupAdmin={isGroupAdmin}
        loggedInUserRole={loggedInUserData?.globalRole || ""}
        setIsSliderOpen={setIsSliderOpen}
        setIsModalOpen={setIsModalOpen}
        handleLeaveGroup={handleLeaveGroup}
        handleDeleteGroup={handleDeleteGroup}
        setIsGroceryListOpen={setIsGroceryListOpen}
      />
      <div className="flex flex-col md:flex-row justify-between p-4">
        <GroupDetails groupchat={groupchat} />
        <MessageSection
          groupId={groupId || 0}
          messages={messages}
          onMessageSent={messages}
        />
      </div>
      <UserListSidebar
        isSliderOpen={isSliderOpen}
        setIsSliderOpen={setIsSliderOpen}
        groupchat={groupchat}
        isGroupAdmin={isGroupAdmin}
        openKickConfirmation={(nickname, userId) =>
          setKickConfirmation({ isOpen: true, userNickname: nickname, userId })
        }
      />
      <GroceryListSidebar
        isGroceryListOpen={isGroceryListOpen}
        setIsGroceryListOpen={setIsGroceryListOpen}
        groupId={groupId || 0}
      />
      <KickConfirmationModal
        isOpen={kickConfirmation.isOpen}
        userNickname={kickConfirmation.userNickname}
        onClose={() =>
          setKickConfirmation({ ...kickConfirmation, isOpen: false })
        }
        onConfirm={() => console.log("Kick user")}
      />
      <LeaveConfirmationModal
        isOpen={leaveConfirmation}
        onClose={() => setLeaveConfirmation(false)}
        onConfirm={handleLeaveGroup}
      />
    </>
  );
};

export default Groupchat;
