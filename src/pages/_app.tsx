import Link from 'next/link'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { linkResolver, repositoryName } from '../services/prismic'
import { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
    // <PrismicProvider
    //   linkResolver={linkResolver}
    //   internalLinkComponent={({ href, children, ...props }) => (
    //     <Link href={href}>
    //       <a {...props}>
    //         {children}
    //       </a>
    //     </Link>
    //   )}
    // >
    //   <PrismicPreview repositoryName={repositoryName}>
    //     <Component {...pageProps} />
    //   </PrismicPreview>
    // </PrismicProvider>
  );
}

export default MyApp;
