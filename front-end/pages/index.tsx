import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
});

const Home: React.FC = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <span>
          <Image
            src="/images/grocerylist.png"
            alt="Gorcery List Logo"
            className={styles.vercelLogo}
            width={50}
            height={50}
          />
          <h1>{t('header.welcome')}</h1>
        </span>

        <div className={styles.description}>
          <p>{t('header.description')}</p>
        </div>
      </main>
    </>
  );
};

export default Home;
