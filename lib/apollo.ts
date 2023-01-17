import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { environment } from 'config';

import { getSession } from 'next-auth/react';

import cache from './cache';
import errorLink from './errorLink';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  credentials: 'include'
});

const authLink = setContext(async (_, { headers }: { headers: Headers }) => {
  const session = await getSession();
  const modifiedHeader = {
    headers: {
      ...headers,
      authorization: session?.accessToken ? `Bearer ${session.accessToken}` : ''
    }
  };
  return modifiedHeader;
});

const apolloClient = new ApolloClient({
  link: from([httpLink]),
  connectToDevTools: process.env.NODE_ENV === 'development',
  cache: new InMemoryCache()
});

export default apolloClient;

// const httpLink = createHttpLink({
//   uri: environment.grapqlServerURL,
//   credentials: 'include'
// });

// const authLink = setContext(async (_, { headers }: { headers: Headers }) => {
//   const session = await getSession();
//   const modifiedHeader = {
//     headers: {
//       ...headers,
//       authorization: session?.accessToken ? `Bearer ${session.accessToken}` : ''
//     }
//   };
//   return modifiedHeader;
// });

// const client = new ApolloClient({
//   link: from([authLink, errorLink, httpLink]),
//   cache
// });

// export default client;
