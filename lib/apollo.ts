import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  from
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import { useMemo } from 'react';

import type { AppProps } from 'next/app';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

export type Client = ApolloClient<NormalizedCacheObject>;

let apolloClient: Client;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ locations, message, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  credentials: 'include'
});

type SSRContext = NextPageContext | GetServerSidePropsContext | null;

const createApolloClient = (ctx?: SSRContext) => {
  const ssrMode = typeof window === 'undefined';

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie: ssrMode ? ctx?.req?.headers.cookie : undefined
      }
    };
  });

  return new ApolloClient({
    credentials: 'include',
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    ssrMode
  });
};

export function initializeApollo(initialState = null, ctx?: SSRContext) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);
  // console.log('initializeApollo', ctx);
  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s)))
      ]
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client: Client, pageProps: AppProps['pageProps']) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: AppProps['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
