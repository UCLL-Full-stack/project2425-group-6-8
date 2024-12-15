import Head from "next/head";
import Header from "@components/header";
import GroupList from "@components/group/GroupList"; 
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next"; 
import { Group } from "@types";
import { useState, useEffect } from "react";
import GroupService from "@services/GroupService";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch("http://localhost:3000/api/group");
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
  const [groups, setGroups] = useState<Array<Group>>();
  const [error, setError] = useState<string>();
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

    if (!loggedInUserData || !loggedInUserData.id) {
      setError("Unauthorized: User is not logged in.");
      return; 
    }

    const response = await GroupService.getGroupsOfUser(loggedInUserData.id);

    if (!response.ok) {
        setError(response.statusText);
    } else {
        const groups = await response.json();
        setGroups(groups);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      <Head>
        <title>{t('group.title')}</title>
      </Head>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <section>
          {error && <div className="text-red-800">{error}</div>}
          {groups && (
              <GroupList
                  group={groups}
              />
          )}
        </section>
      </main>
    </>
  );
};

export default GroupPage;
