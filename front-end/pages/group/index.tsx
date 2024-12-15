import Head from "next/head";
import Header from "@components/header";
import GroupList from "@components/group/GroupList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import GroupService, { Group } from "@services/GroupService"; 

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const groups = await GroupService.getAllGroups(); 
    return {
      props: {
        groups,
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return {
      props: {
        groups: [],
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  }
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
          <h1 className="text-2xl font-bold mb-4">{t("group.title")}</h1>
          {groups.length > 0 ? (
            <GroupList groups={groups} />
          ) : (
            <p className="text-gray-500">{t("group.validate.noGroups")}</p>
          )}
        </section>
      </main>
    </>
  );
};

export default GroupPage;
