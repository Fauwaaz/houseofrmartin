import Head from "next/head";
import React from "react";
import styles from "../styles/Layout.module.css";
import Cart from "./Cart";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <section className={styles.layout}>
      <Head>
        <title>Nextjs & Wordpress E-Commerce</title>
        <meta
          name="description"
          content="Nextjs with Wordpress Headless CMS E-Commerce Template"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cart />
      <>
        <Navbar />

        <main className={styles.main}>{children}</main>
        <Footer />
      </>
    </section>
  );
};

export default Layout;
