// pages/_app.js
import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import { StateContext } from "../context/StateContext";
import "../styles/globals.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "../components/loading";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleStop = () => {
      // Wait for images and assets
      if (document.readyState === "complete") {
        setLoading(false);
      } else {
        // fallback: wait until window load event
        window.addEventListener("load", () => setLoading(false), { once: true });
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <ApolloProvider client={client}>
      <StateContext>
        {loading ? <Loading /> : <Component {...pageProps} />}
      </StateContext>
    </ApolloProvider>
  );
}

export default App;