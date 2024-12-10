import Head from "next/head";
import Header from "@components/header";
import UserRegisterForm from "@components/users/UserRegisterForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const Login: React.FC = () => {
    const { t } = useTranslation("common");
    return (
        <>
            <Head>
                <title>{t('register.title')}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserRegisterForm />
                </section>
            </main>
        </>
    );
};

export default Login;
