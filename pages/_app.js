import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import { StateContext } from "../context/StateContext";
import "../styles/globals.css";

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
