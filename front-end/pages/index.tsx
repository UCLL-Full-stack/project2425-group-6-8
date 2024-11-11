import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Shared Grocery List</title>
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
          <h1>Welcome!</h1>
        </span>

        <div className={styles.description}>
          <p>
            This is a shared Grocery list you can use with your family or friends.
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
