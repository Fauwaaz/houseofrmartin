import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { RiArrowRightSLine } from "react-icons/ri";
import { ValueAnimation } from "../animations";
import HeroBackground from "../images/HeroBackground.png";
import styles from "../styles/Hero.module.css";

const Hero = ({ addToCart, image, url }) => {
  const [slide, setSlide] = useState(0);
  const timeoutRef = useRef(null);

  const features = [
    {
      value: 56,
      name: "Megapixels",
      message: "Take photographs that are crystal clear",
    },
    {
      value: 8,
      name: "Colors",
      message: "Available in more than 8 colors",
    },
    {
      value: 48,
      name: "Hours",
      message: "No need to charge it for up to 48 hours",
    },
  ];

  const delay = 3500;

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setSlide((prevSlide) =>
          prevSlide === features.length - 1 ? 0 : prevSlide + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [slide]);
  //
  return (
    <section className="min-h-screen w-full relative hero">
      {/* <div className={styles.left}>
        <h3 className={styles.title}>
          Our Best <br />
          Collections
          <br /> For You
        </h3>
        <p className={styles.description}>
          The latest mobile phone models available to you with the best prices
          delivered to you in no time.
        </p>
        <div className={styles.buttons}>
          <button className={styles.addToCart} onClick={addToCart}>
            <FiShoppingBag />
            Add to cart
          </button>
          <Link href={`/product/${url}`}>
            <button className={styles.button}>
              <div className={styles.buttonImage}>
                <Image
                  alt="hero image"
                  src={image}
                  priority
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                />
              </div>
              <span className={styles.buttonText}>
                More info <RiArrowRightSLine />{" "}
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.image}>
          <Image
            src={HeroBackground}
            layout="fill"
            objectFit="contain"
            alt="hero background"
          />
          <Image
            src={image}
            priority
            layout="fill"
            objectFit="contain"
            alt="hero background two"
          />
          <div className={styles.offer}>
            <h4>Get up to 30% off</h4>
            <p>We offer a 30% discount from orders above $20</p>
          </div>

          <div className={styles.features}>
            <div style={{}}>
              <div className={styles.top}>
                <div>
                  <motion.span
                    key={slide}
                    initial="initial"
                    animate="animate"
                    variants={ValueAnimation}
                  >
                    {features[slide].value}
                  </motion.span>
                </div>

                <motion.p
                  key={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={ValueAnimation}
                >
                  {features[slide].name}
                </motion.p>
              </div>
            </div>
            <div className={styles.bottom}>
              <motion.p
                key={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={ValueAnimation}
              >
                {features[slide].message}
              </motion.p>
            </div>
            <div className={styles.dots}>
              {features.map((feature, i) => (
                <button onClick={() => setSlide(i)} key={i}>
                  <span
                    className={
                      i === slide ? `${styles.active}` : `${styles.inactive}`
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      <div className="w-full hidden lg:flex">
        <div
          style={{
            backgroundImage: "url('/hero/rmartin-hero-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "30%",
            height: "100vh", // or any height you want
          }}
        >
        </div>
       <div
          style={{
            backgroundImage: "url('/hero/rmartin-hero-2.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "40%",
            height: "100vh", // or any height you want
          }}
        >
        </div>
        <div
          style={{
            backgroundImage: "url('/hero/rmartin-hero-3.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "30%",
            height: "100vh", // or any height you want
          }}
        >
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center w-full font-geograph-md">
        <h1 className="text-8xl text-[#DBDBDB] text-outline">Wear What makes you -<span className="text-outline-white text-[#FF0000]">you</span></h1>
      </div>
    </section>
  );
};

export default Hero;