import Head from "next/head";
import Header from "@components/header";
import UserLoginForm from "@components/users/UserLoginForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const users = [
  {
    name: 'Dagobert Duck',
    email: 'dagoduck@duckberg.com',
    nickname: 'Wise Old Geezer',
    password: 'PassWordOfDagobert123',
    globalRole: 'ApplicationAdmin',
  },
  {
    name: 'Donald Duck',
    email: 'donald@gmail.com',
    nickname: 'SuperDonaldd',
    password: 'PassWordOfDonald123',
    globalRole: 'user',
  },
];

const Login: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t('login.title')}</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <UserLoginForm />
          
          {/* Table for users */}
          <table className="table-auto mt-6 w-full max-w-4xl">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Nickname</th>
                <th className="px-4 py-2 text-left">Password</th>
                <th className="px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{user.nickname}</td>
                  <td className="px-4 py-2">{user.password}</td>
                  <td className="px-4 py-2">{user.globalRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default Login;
