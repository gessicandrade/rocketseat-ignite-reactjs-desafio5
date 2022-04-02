import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import Header from '../../components/Header';
// import { Comments } from '../../components/Coments';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Head from 'next/head';
import { useState } from 'react';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  uid: string;
  data: {
    uid: string;
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
        type: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  prevPost: Post | undefined;
  nextPost: Post | undefined;
}

export default function Post({ post, nextPost, prevPost }: PostProps) {

  // function readTime() {
  //   const date1 = new Date(post.last_publication_date).getTime();
  //   const date2 = new Date().getTime();
  //   const diffTimes = Math.abs(date1 - date2)
  //   const diffMinutes = Math.floor(diffTimes / 60000)
  //   // const diffHours = Math.floor(diffMinutes / 60)
  //   // const diffDays = Math.floor(diffHours / 24)
  //   // let ago = ''
  //   // if (diffMinutes < 60) {
  //   //   ago = `${diffMinutes} min`
  //   // } else if (diffHours < 24) {
  //   //   ago = `${diffHours} min`
  //   // } else {
  //   //   ago = `${diffDays} min`
  //   // }

  //   return `${diffMinutes} min`;

  // };

  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Head>
        <title>Posts | Spacetraveling | {post.data.title}</title>
      </Head>

      <div className={styles.banner}>
        <img src={post.data.banner.url} alt='banner' />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{post.data.title}</h1>
        
        <div className={styles.info}>
          <span>
            <FiCalendar size={20} />  
            { format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }) }
          </span>
          <span><FiUser size={20} /> {post.data.author}</span>
          <span><FiClock size={20} /> 4 min</span>
        </div>


        <div className={styles.postContent}>
          {/* {post.data.content} */}
          {post.data.content.map(content => (
            <div key={content?.heading}>
              <h2>{content.heading}</h2>
              {content.body.map((body, index) => {
                const key = index;

                return body.type === 'list-item' ? (
                  <ul key={key}>
                    <li>{body.text}</li>
                  </ul>
                ) : (
                  <p key={key}>{body.text}</p>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
    }
  );

  const slugs = postsResponse.results.map(slug => slug.uid);

  return {
    paths: slugs.map(slug => {
      return {
        params: { slug },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date]',
    }
  );

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      // content: RichText.asHtml(response.data.content)
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(body => {
            return {
              text: body.text,
              type: body.type,
              spans: [...body.spans],
            };
          }),
        };
      }),
    },
  };

  return {
    props: {
      post,
      prevPost: prevPost?.results[0] || null,
      nextPost: nextPost?.results[0] || null
    },
    revalidate: 3600, // 1 hour
  };
};
