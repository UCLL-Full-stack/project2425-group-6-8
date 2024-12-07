import Head from "next/head";
import Header from "@components/header";
import UserLoginForm from "@components/group/GroupForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const Group: React.FC = () => {
    const { t } = useTranslation("common");
    return (
        <>
            <Head>
                <title>{t('header.nav.group')}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserLoginForm />
                </section>
            </main>
        </>
    );
};

export default Group;
