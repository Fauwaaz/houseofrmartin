import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.WP_GRAPHQL_API,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      nextFetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
      nextFetchPolicy: "no-cache",
    },
  },
});

export default client;