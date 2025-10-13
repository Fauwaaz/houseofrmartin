import Link from "next/link";
import { useEffect } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { Layout } from "../components";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/Success.module.css";
import { runConfetti } from "../utils/utils";

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runConfetti();
  }, []);

  return (
    <Layout>
      <section className={styles.section}>
        <div className={styles.wrapper}>
          <p className={styles.icon}>
            <BsBagCheckFill />
          </p>
          <h2>Thank you for your order!</h2>
          <p>
            An email sent to you with your order receipt, make sure to check
            your inbox.
          </p>
          <p>
            For any issues or questions , please email us
            <Link href="mailto:domvournias@gmail.com" className={styles.mail}>
              {" "}
              domvournias@gmail.com
            </Link>
          </p>
          <Link href="/">
            <button className={styles.button}>Continue Shopping</button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Success;
