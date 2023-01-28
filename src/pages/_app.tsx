import 'styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { useApollo } from '@/lib/apollo';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </SessionProvider>
  );
}
