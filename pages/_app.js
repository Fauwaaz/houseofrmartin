// pages/_app.js
import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import { StateContext } from "../context/StateContext";
import "../styles/globals.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { WishlistProvider } from "../context/WishListStateContext.js";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);

    const handleStop = () => {
      // Wait for images + videos to finish loading
      const waitForAssets = () => {
        const images = Array.from(document.images);
        const videos = Array.from(document.querySelectorAll("video"));

        const imagePromises = images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              img.onload = resolve;
              img.onerror = resolve;
            })
        );

        const videoPromises = videos.map(
          (video) =>
            new Promise((resolve) => {
              if (video.readyState >= 3) return resolve(); // HAVE_FUTURE_DATA
              video.oncanplaythrough = resolve;
              video.onerror = resolve;
            })
        );

        return Promise.all([...imagePromises, ...videoPromises]);
      };

      waitForAssets().then(() => setLoading(false));
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
        <WishlistProvider>
          {loading ? <Loading /> : <Component {...pageProps} />}
          <Toaster position="bottom-center" reverseOrder={false} />
        </WishlistProvider>
      </StateContext>
    </ApolloProvider>
  );
}

export default App;