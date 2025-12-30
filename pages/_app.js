import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo";
import { StateContext } from "../context/StateContext";
import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { WishlistProvider } from "../context/WishListStateContext.js";
import { initDataLayer } from "../utils/dataLayer";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.dataLayer) {
        window.dataLayer.push({ event: "pageview", pagePath: url });
      }

      if (!url.includes("/auth")) {
        localStorage.setItem("lastVisited", url);
      }
    };

    handleRouteChange(router.asPath);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () =>
      router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  if (typeof window !== "undefined") {
    initDataLayer();
  }

  if (typeof window !== "undefined") {
    const LAST_CLEAR = "lastCookieClearTime";
    const now = Date.now();
    const lastClear = Number(localStorage.getItem(LAST_CLEAR)) || 0;

    if (now - lastClear > 24 * 60 * 60 * 1000) {
      localStorage.clear();
      sessionStorage.clear();

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      localStorage.setItem(LAST_CLEAR, String(now));
    }
  }

  useEffect(() => {
    const handleStart = () => setLoading(true);

    const handleStop = async () => {
      const images = Array.from(document.images);
      const videos = Array.from(
        document.querySelectorAll("video")
      );

      await Promise.all([
        ...images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              img.onload = resolve;
              img.onerror = resolve;
            })
        ),
        ...videos.map(
          (video) =>
            new Promise((resolve) => {
              if (video.readyState >= 3) return resolve();
              video.oncanplaythrough = resolve;
              video.onerror = resolve;
            })
        ),
      ]);

      setLoading(false);
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

  useEffect(() => {
    async function checkBuildId() {
      try {
        const res = await fetch("/build-id.json", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;

        const data = await res.json();
        if (!data?.buildId) return;

        const stored = localStorage.getItem("buildId");
        if (stored !== data.buildId) {
          localStorage.clear();
          sessionStorage.clear();

          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                `=;expires=${new Date(0).toUTCString()};path=/`
              );
          });

          localStorage.setItem("buildId", data.buildId);
        }
      } catch (err) {
        console.error("checkBuildId error:", err);
      }
    }

    checkBuildId();
  }, []);

useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data?.user?.id) return;
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            phone: data.user.meta?.billing_phone || null,
            name: data.user.name,
          })
        );
      })
      .catch(() => {});
  }, []);


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