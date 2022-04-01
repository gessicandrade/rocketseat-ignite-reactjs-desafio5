import { GetStaticPaths, GetStaticProps } from 'next';
import Head from "next/head";

import { getPrismicClient, linkResolver } from '../../services/prismic';
import * as prismicH from '@prismicio/helpers';
import * as prismic from '@prismicio/client'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { PrismicRichText, PrismicText } from '@prismicio/react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    updatedAt: string;
    ago: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}:PostProps) {
  
  return (
    <>
      <Head>
        <title>Posts | Spacetraveling | {post.data.title}</title>
      </Head>

      <div className={styles.banner}>
        <img src={post.data.banner.url} alt='banner' />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{post.data.heading}</h1>
        
        <div className={styles.info}>
          <span><img src="/images/calendar.png" alt="icone de calendário" /> {post.data.updatedAt}</span>
          <span><img src="/images/user.png" alt="icone de usuário" /> {post.data.author}</span>
          <span><img src="/images/clock.png" alt="icone de relógio" /> {post.data.ago}</span>
        </div>


        <div className={styles.postContent}>
          {post.data.content.map(content => (
            <div key={content.heading+new Date()}>
              <h2>{content.heading}</h2>
              <PrismicRichText field={content.body.text} />
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getPrismicClient();
  // const posts = await client.getAllByType('post')
  const posts = await client.query(
    [prismic.predicates.at('document.type', 'post')],
    {
      fetch: [],
      pageSize: 100,
    }
  )
  // const paths = posts.map((post) => ({
  //   params: { 
  //     slug: post.uid,
  //   },
  // }))
  
  // return { paths, fallback: false }
  return {
    paths: posts.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true,
  }
};

export const getStaticProps = async context => {
  const client = getPrismicClient();
  const uid = context.params.slug
  const response = await client.getByUID<any>('post', uid) || {}

  const date1 = new Date(response.last_publication_date).getTime();
  const date2 = new Date().getTime();
  const diffTimes = Math.abs(date1 - date2)
  const diffMinutes = Math.floor(diffTimes / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  let ago = `${diffMinutes} min`
  
  if (diffMinutes < 60) {
    ago = `${diffMinutes} min`
  } else if (diffHours < 24) {
    ago = `${diffHours} hrs`
  } else {
    ago = `${diffDays} dias`
  }
  
  const post = {
    first_publication_date: new Date(response.first_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    data: {
      author: response.data.author,
      banner: {
        url: response.data.banner.url
      },
      content: {
        body: {
          spans: [],
          text: prismicH.asHTML(response.data.content.body) 
        }
      },
      heading: response.data.title,
      slug: response.uid,
      excerpt: response.data.subtitle,
      updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      ago: ago
    }
  }
  return { props: { post } }
};
