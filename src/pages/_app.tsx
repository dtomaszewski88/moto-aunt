import 'styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

import { IntlProvider } from 'react-intl';

import Layout from '@/components/Layout';
import { useApollo } from '@/lib/apollo';
import messages from 'i18n';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const { locale } = useRouter();
  const selectedLocale = locale ?? 'en';

  return (
    <IntlProvider locale={selectedLocale} messages={messages[selectedLocale]}>
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SessionProvider>
    </IntlProvider>
  );
}
