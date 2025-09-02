"use client";

import { Layout } from "../components";
import Hero from "../components/Hero";
import { useStateContext } from "../context/StateContext";
import client from "../libs/apollo";
import { GET_ALL } from "../utils/queries";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import stylesCommon from "../styles/common.module.css";
import BeforeFooter from "../components/BeforeFooter";
import { useState } from "react";

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_ALL,
  });

  const products = data?.products?.nodes || [];

  const category = data?.category;
  const posts = category?.posts?.nodes || [];
  const firstPost = posts.length > 0 ? posts[0] : null;

  const banner = firstPost?.banner || {
    title: "Default Banner Title",
    description: "Default Banner Description",
    uri: "#",
    image: {
      sourceUrl: "/placeholder.jpg",
    },
  };

  return {
    props: {
      products,
      banner,
    },
    revalidate: 1,
  };
}

const Home = ({ products, banner }) => {
  const { onAdd, qty } = useStateContext();

  const categoriesSection = [
    { title: "Co-ord set", img: "/category/co-ordset.png", link: "#" },
    { title: "Shirts", img: "/category/shirts.png", link: "#" },
    { title: "Pants", img: "/category/pants.png", link: "#" },
    { title: "Tshirts", img: "/category/tshirts.png", link: "#" },
  ];

  // Track which card is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <Layout>
        <Hero />

        <section className="py-10 w-full category">
          <div>
            <h2 className="text-center uppercase text-4xl font-akkurat">
              Our Categories
            </h2>
            <p className="pt-1 text-sm lg:text-lg text-center">
              Explore styles for every mood and moment
            </p>
          </div>
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-3 lg:grid-cols-4 mt-5">
            {categoriesSection.map((category, index) => (
              <div
                key={index}
                className="h-[600px] w-[450px] bg-slate-700 rounded-[20px] flex flex-col items-center justify-center shadow-sm m-4 relative overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute w-full h-full bg-black opacity-30"></div>
                  <Image
                    src={category.img}
                    alt={category.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                    unoptimized
                    quality={100}
                  />
                </motion.div>

                <div className="z-10 text-center flex flex-col gap-4 items-center">
                  <h3 className="text-xl text-white font-semibold">
                    {category.title}
                  </h3>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          href={category.link}
                          className={`text-white border border-white rounded-full py-2 px-5 uppercase ${stylesCommon["btn-outline-white"]}`}
                        >
                          Shop Now
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Banner */}
        <section className="story-banner min-h-screen bg-[url(/story/story-banner-bg.png)] bg-cover bg-no-repeat bg-center flex items-center justify-center w-full h-full">
          <div className="grid grid-cols-2 gap-10">
            <div className="story-banner-image "></div>
            <div className="story-banner-content ">
              <h2 className="text-4xl lg:text-5xl font-geograph text-white mb-6">
                House of R-Martin Wear Your Story
              </h2>
              <p className="text-white text-lg lg:text-xl mb-6">
                At House of RMartin, we believe that fashion is more than just
                clothing; it&apos;s a form of self-expression and empowerment. Our
                journey began with a vision to create a brand that celebrates
                individuality and inspires confidence through unique,
                high-quality designs.
              </p>
              <Link
                href="/about"
                className={`text-black bg-white rounded-full py-2 px-5 uppercase ${stylesCommon["btn-outline-black"]}`}
              >
                Shop All
              </Link>
            </div>
          </div>
        </section>

        <BeforeFooter />
      </Layout>
    </>
  );
};

export default Home;
