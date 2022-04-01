import { GetStaticProps } from 'next';
import Head from "next/head";

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Posts | Spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <span><img src="/images/calendar.png" alt="icone de calendário" /> 15 Mar 2021</span>
              <span><img src="/images/user.png" alt="icone de usuário" /> Joseph Oliveira</span>
            </div>
          </a>
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</p>
            <div className={styles.info}>
              <span><img src="/images/calendar.png" alt="icone de calendário" /> 15 Mar 2021</span>
              <span><img src="/images/user.png" alt="icone de usuário" /> Joseph Oliveira</span>
            </div>
          </a>
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <span><img src="/images/calendar.png" alt="icone de calendário" /> 15 Mar 2021</span>
              <span><img src="/images/user.png" alt="icone de usuário" /> Joseph Oliveira</span>
            </div>
          </a>
          <a className={styles.readmore}>Carregar mais posts</a>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
