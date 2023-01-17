import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  credentials: 'include'
});

const apolloClient = new ApolloClient({
  link: httpLink,
  connectToDevTools: process.env.NODE_ENV === 'development',
  cache: new InMemoryCache()
});

export default apolloClient;
