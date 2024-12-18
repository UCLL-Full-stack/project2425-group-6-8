import Head from "next/head";
import Header from "@components/header";
import GroupForm from "@components/group/GroupForm";
import GroupList from "@components/group/GroupList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next"; 
import { Group } from "@types";
import { useState, useEffect } from "react";
import GroupService from "@services/GroupService";
import Link from "next/link";  

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch("http://localhost:3000/group");
  const groups = await res.json();

  return {
    props: {
      groups,
      ...(await serverSideTranslations(locale ?? 'en', ["common"])),
    },
  };
};
 
const GroupPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [error, setError] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

  const getGroups = async () => {
    setError("");

    if (!loggedInUserData) {
      setError("Unauthorized: User is not logged in.");
      return;
    }

    try {
      const response = await GroupService.getGroupsOfUser(loggedInUserData.id);
      const groups = await response.json();

      if (groups.length < 1) {
        setError("You are not in any group yet, please create one or join one.");
      }
      setGroups(groups);
    } catch (err) {
      setError("Failed to fetch groups. Please try again.");
    }
  };

  const refreshGroups = () => {
    getGroups();
  };

  useEffect(() => {
    setLoggedInUser(loggedInUserData?.name);
    getGroups();
  }, []);

  return (
    <>
      <Head>
        <title>{t("group.title")}</title>
      </Head>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <section>
          {loggedInUser && <GroupForm refreshGroups={refreshGroups} />}
          {error && <div className="text-red-800">{error}</div>}
          {!error && 
            <GroupList
              group={groups}
            />
          }
        </section>
      </main>
    </>
  );
};

export default GroupPage;
