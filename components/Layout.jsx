import Head from "next/head";
import styles from "../styles/Layout.module.css";
import Cart from "./Cart";
import Footer from "./Footer";
import Navbar from "./Navbar";
import FooterBar from "./common/FooterBar";
// import ChatwootWidget from "./ChatwootWidget";

const Layout = ({ children }) => {
  return (
    <section className={styles.layout}>
      <Head>
        <title>House of RMartin - Fashion</title>
        <meta
          name="description"
          content="House of RMartin - Fashion"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Cart />
      <>
        <Navbar />
          <main className={styles.main}>
            {children}
            {/* <ChatwootWidget /> */}
          </main>
        <FooterBar />
        <Footer />
      </>
    </section>
  );
};

export default Layout;