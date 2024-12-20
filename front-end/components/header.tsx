import Link from 'next/link';
import { useEffect, useState } from "react";
import Language from "./language/Language";
import { useTranslation } from "next-i18next";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState<string | null>(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const loggedInUserData = (() => {
      const item = localStorage.getItem("loggedInUser");
      return item ? JSON.parse(item) : null;
    })();
    const userDataToShow = loggedInUserData ? { name: loggedInUserData.name, role: loggedInUserData.globalRole } : null;
    setLoggedInUser(userDataToShow?.name);
    setLoggedInUserRole(userDataToShow?.role);
  }, []);

  const handleClick = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <header className={`p-3 mb-3 border-bottom bg-gradient-to-br from-green-900 to-green-500 flex flex-col items-center ${className}`}>
      <a className="flex mb-2 md:mb-5 text-white-50 text-3xl text-gray-300">
        {t('app.title')}
      </a>
      <nav className="items-center flex md:flex-row flex-col">
        <Link href="/" className="px-4 text-xl text-white hover:bg-gray-600 rounded-lg">
          {t('header.nav.home')}
        </Link>

        <Link href="/group" className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg">
          {t('header.nav.group')}
        </Link>

        {loggedInUserRole === "ApplicationAdmin" && (
          <Link
            href="/users"  className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg" >
            {t('header.nav.users')}
          </Link>
        )}

        {!loggedInUser && (
          <Link
            href="/login"
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            {t('header.nav.login')}
          </Link>
        )}

        {!loggedInUser && (
          <Link
            href="/register"
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            {t('header.nav.register')}
          </Link>
        )}

        {loggedInUser && (
          <a
            href="/login"
            onClick={handleClick}
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            {t('header.nav.logout')}
          </a>
        )}
        {loggedInUser && (
          <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 grow">
            {t('header.welcome')}, {loggedInUser}!
          </div>
        )}
      </nav>
      <Language />
    </header>
  );
};

export default Header;
