import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8020/graphql',
  // Add these options to handle SSL issues in development
  credentials: 'same-origin',
  // If you're having CORS issues, you might need this:
  // credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;