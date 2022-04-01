import { GetStaticPaths, GetStaticProps } from 'next';
import Head from "next/head";

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
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

export default function Post() {
  return (
    <>
      <Head>
        <title>Posts | Spacetraveling | Criando um app CRA do zero</title>
      </Head>

      <div className={styles.banner}>
        <img src="/images/banner-sample.png" alt="banner do post" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Criando um app CRA do zero</h1>
        
        <div className={styles.info}>
          <span><img src="/images/calendar.png" alt="icone de calendário" /> 15 Mar 2021</span>
          <span><img src="/images/user.png" alt="icone de usuário" /> Joseph Oliveira</span>
          <span><img src="/images/clock.png" alt="icone de relógio" /> 4 min</span>
        </div>


        <div className={styles.postContent}>
          <h2>Proin et varius</h2>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.</p>
          <p>Ut venenatis mauris vel libero pretium, et pretium ligula faucibus. Morbi nibh felis, elementum a posuere et, vulputate et erat. Nam venenatis.</p>
          
          <h2>Cras laoreet mi</h2>

          <p>
            Nulla auctor sit amet quam vitae commodo. Sed risus justo, vulputate quis neque eget, dictum sodales sem. 
            In eget felis finibus, mattis magna a, efficitur ex. Curabitur vitae justo consequat sapien gravida auctor a non risus. 
            Sed malesuada mauris nec orci congue, interdum efficitur urna dignissim. Vivamus cursus elit sem, 
            vel facilisis nulla pretium consectetur. <strong>Nunc congue</strong>.
          </p>

          <p>
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
            Aliquam consectetur massa nec metus condimentum, sed tincidunt enim tincidunt. 
            Vestibulum fringilla risus sit amet massa suscipit eleifend. Duis eget metus cursus, suscipit ante ac, iaculis est. 
            Donec accumsan enim sit amet lorem placerat, eu dapibus ex porta. Etiam a est in leo pulvinar auctor. 
            Praesent sed vestibulum elit, consectetur egestas libero.
          </p>

          <p>
            Ut varius quis velit sed cursus. Nunc libero ante, hendrerit eget consectetur vel, viverra quis lectus. 
            Sed vulputate id quam nec tristique. <a href="#">Etiam lorem purus</a>, imperdiet et porta in, placerat non turpis. 
            Cras pharetra nibh eu libero ullamcorper, at convallis orci egestas. Fusce ut est tellus. 
            Donec ac consectetur magna, nec facilisis enim. Sed vel tortor consectetur, facilisis felis non, accumsan risus. 
            Integer vel nibh et turpis.
          </p>

          <p>Nam eu sollicitudin neque, vel blandit dui. Aliquam luctus aliquet ligula, sed:</p>

          <ul>
            <li>
              Suspendisse ac facilisis leo. Sed nulla odio, aliquam ut lobortis vitae, viverra quis risus. Vivamus pulvinar enim sit amet elit porttitor bibendum. Nulla facilisi. Aliquam libero libero, porta ac justo vitae, dapibus convallis sapien. Praesent a nibh pretium, ultrices urna eget, vulputate felis. Phasellus ac sagittis ipsum, a congue lectus. Integer interdum ut velit vehicula volutpat. Nulla facilisi. Nulla rhoncus metus lorem, sit amet facilisis ipsum faucibus et. Lorem ipsum.
            </li>
          </ul>
        </div>

      </div>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
