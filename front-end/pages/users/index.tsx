import Head from "next/head";
import Header from "@components/header";
import UserOverViewTable  from "@components/users/UsersOverViewTable";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

  const loggedInUserData = (() => {
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
    }
    const item = localStorage.getItem("loggedInUser");
    return item ? JSON.parse(item) : null;
  })();

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const Users: React.FC = () => {
    const { t } = useTranslation("common");
    return (
        <>
           
          <Head>
              <title>{t('users.title')}</title>
          </Head>
          <Header />
          {loggedInUserData?.globalRole === "ApplicationAdmin" ? (
            <main>
              <section className="p-6 min-h-screen flex flex-col items-center">
                <UserOverViewTable />
              </section>
            </main>
          ) : ( 
            <p className="fixed inset-0 flex items-center justify-center text-red-500 text-xl font-bold">You are not allowed to view this page since you aren't an Admin.</p>
          )}

        </>
    );
};

export default Users;
