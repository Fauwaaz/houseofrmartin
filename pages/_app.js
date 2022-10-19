import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
