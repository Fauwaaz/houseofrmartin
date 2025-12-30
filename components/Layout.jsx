import Head from "next/head";
import styles from "../styles/Layout.module.css";
import Cart from "./Cart";
import Footer from "./Footer";
import Navbar from "./Navbar";
import FooterBar from "./common/FooterBar";

const Layout = ({ children }) => {
  return (
    <section className={styles.layout}>
      <Head>
        <title>Best Men's Fashion | House of R-Martin</title>
        <meta name="description" content="House of R-Martin has a wide range of clothing products in its portfolio. We have various varieties of apparel that are trendsetters and best sellers amongst our consumers. Our portfolio covers Men's Fashion, Men's innerwear, Women's innerwear, Kids' innerwear, Socks Collections, and Belts. We offer softness of touch and vibrancy of colour that never seems to fade." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/11/favicon.png"
        />
        <meta name="author" content="House of R-Martin" />
        <meta name="publisher" content="House of R-Martin" />
        <meta name="canonical" content="https://www.houseofrmartin.com/" />
        <meta name="keywords" content="Menswear, Fashion, Clothing, Apparel, Belts, Trendy Clothing, Best Sellers, Comfortable Clothing, Stylish Apparel" />
        <script
          type="text/javascript"
          src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
          id="aisensy-wa-widget"
          widget-id="aaat2j"
        >
        </script>
        <meta name="robots" content="index, follow" />
      </Head>
      <Cart />
      <Navbar />

      <main className={styles.main}>{children}</main>

      <FooterBar />
      <Footer />
    </section>
  );
};

export default Layout;