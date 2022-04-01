import { GetStaticProps } from 'next';
import Head from "next/head";
import Link from 'next/link';

// import { getPrismicClient } from '../services/prismic';
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

export default function Home({posts}) {
  console.log(posts);
  
  return (
    <>
      <Head>
        <title>Posts | Spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
            <a>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
              <div className={styles.info}>
                <span><img src="/images/calendar.png" alt="icone de calendário" /> {post.updatedAt}</span>
                <span><img src="/images/user.png" alt="icone de usuário" /> {post.author}</span>
              </div>
            </a>
            </Link>
          ))}
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

export async function getStaticProps({ params, previewData }) {
  // console.log(previewData);
  
  const client = getPrismicClient({ previewData })

  // const page = await client.getByUID('page', params.uid)
  const response = await client.getAllByType('post')
  // console.log(response);

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.subtitle,
      content: post.data.content,
      banner: post.data.banner,
      author: post.data.author,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }   
  })

  return {
    props: { posts },
  }
}
