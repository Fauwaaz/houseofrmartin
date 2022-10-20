import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import "../styles/globals.css";
import { StateContext } from "../context/StateContext";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <StateContext>
        <Component {...pageProps} />
      </StateContext>
    </ApolloProvider>
  );
}

export default App;
