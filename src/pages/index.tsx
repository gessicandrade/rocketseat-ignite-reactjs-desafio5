import { GetStaticProps } from 'next';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';

// import HomePost from '../components/HomePost';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';import Head from 'next/head';
;

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
  preview?: boolean;
}

export default function Home({ postsPagination, preview = false }: HomeProps) {

  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [results, setResults] = useState<Post[]>(
    postsPagination.results.map(result => {
      return {...result};
    })
  );

  function handleNextPage(): void {
    fetch(nextPage).then(response => {
      response.json().then(responsePrismic => {
        setNextPage(responsePrismic.next_page);

        const posts = responsePrismic.results.map(post => {
          
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setResults([...results, ...posts]);
      });
    });
  }

  return (
    <>
      <Head>
        <title>Posts | Spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
            <a>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <span>
                  <FiCalendar size={20} />  
                  { format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }) }
                </span>
                <span><FiUser size={20} /> {post.data.author}</span>
              </div>
            </a>
            </Link>
          ))}

          {postsPagination.next_page !== null && (
            <button type="button" className={styles.readmore} onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false, previewData }) => {
  const client = getPrismicClient();

  const response = await client.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      ref: previewData?.ref ?? null,
      pageSize: 1,
      page: 2
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    } as Post;
  });

  // const posts = response.map(post => {
  //   return {
  //     slug: post.uid,
  //     title: post.data.title,
  //     excerpt: post.data.subtitle,
  //     content: post.data.content,
  //     banner: post.data.banner,
  //     author: post.data.author,
  //     updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
  //       day: '2-digit',
  //       month: 'long',
  //       year: 'numeric'
  //     })
  //   }   
  // })

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
      preview,
    },
  };
}
