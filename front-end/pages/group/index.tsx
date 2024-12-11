import Head from "next/head";
import Header from "@components/header";
import GroupList from "@components/group/GroupList"; 
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next"; 

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

type Group = {
  id: string;
  name: string;
};

const GroupPage: React.FC<{ groups: Group[] }> = ({ groups }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("header.nav.group")}</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">{t("group.overviewTitle")}</h1>
          {groups.length > 0 ? (
            <GroupList groups={groups} />
          ) : (
            <p className="text-gray-500">{t("group.noGroups")}</p>
          )}
        </section>
      </main>
    </>
  );
};

export default GroupPage;
