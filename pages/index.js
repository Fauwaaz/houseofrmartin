"use client";

import { Layout, ProductCard } from "../components";
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
import { colorMap } from "../utils/data";

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

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <Layout>
        <Hero />

        <section className="py-10 w-full category justify-items-center">
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
                          className={`text-white border border-white rounded-full py-2 px-5 uppercase bg-white/20 backdrop-blur-sm ${stylesCommon["btn-outline-white"]}`}
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

        <section className="story-banner min-h-screen bg-[url(/story/story-banner-bg.png)] bg-cover bg-no-repeat bg-center flex items-center justify-center w-full h-full">
          <div className="grid grid-cols-2 gap-10 justify-items-center">
            <div className="story-banner-image"></div>
            <div className="story-banner-content w-3/4 ">
              <h2 className="text-3xl lg:text-6xl font-geograph-md text-white mb-6 text-outline">
                House of <span className="text-red-600 stroke-black">R-Martin</span> Wear Your Story
              </h2>
              <p className="text-white text-lg lg:text-xl mb-6">
                Cloths just dont fit your body, they fit your ambition. Step out with confidence that&apos;s tailor made for you.
              </p>
              <Link
                href="/about"
                className={`text-black bg-white rounded-full py-3 px-[30px] uppercase ${stylesCommon["btn-outline-black"]}`}
              >
                Shop All
              </Link>
            </div>
          </div>
        </section>



        <section className="py-10 w-full recents text-center">
          <div>
            <h2 className="text-center uppercase text-4xl font-akkurat">
              Our Bestsellter
            </h2>
            <p className="pt-1 text-sm lg:text-lg text-center">
              Don&apos;t Miss Out
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-5 lg:px-10 my-10">
            {products.map((product) => {
              let displayPrice = null;
              let firstVariation = null;

              if (product.__typename === "VariableProduct" && product.variations?.nodes?.length > 0) {
                const sorted = [...product.variations.nodes].sort(
                  (a, b) => parseFloat(a.price) - parseFloat(b.price)
                );
                firstVariation = sorted[0];
                displayPrice = firstVariation.price;
              }

              return (
                <div
                  key={product.id}
                  className="bg-white shadow-sm rounded-[20px] flex flex-col items-center overflow-hidden pb-4 relative"
                >
                  <div className="bg-black/70 w-[150px] py-2 text-sm text-white text-center absolute rounded-full z-10 uppercase top-3 left-3">
                    Best Seller
                  </div>


                  <Link href={`/product/${product.slug}`} className="w-full relative group">
                    <Image
                      src={product.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                      alt={product.name}
                      width={600}
                      height={300}
                      className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    {product.galleryImages?.nodes?.length > 0 && (
                      <Image
                        src={product.galleryImages.nodes[0].sourceUrl}
                        alt={`${product.name} gallery`}
                        width={600}
                        height={300}
                        className="object-cover absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    )}
                  </Link>
                  {/* <button
                    onClick={() => onAdd(product, qty)}
                    className="px-3 py-3 bg-black text-white w-full text-center hover:bg-gray-900 cursor-pointer"
                  >
                    Add to Bag
                  </button> */}

                  <div className="flex w-full items-center justify-between px-3">

                    <h3 className="mt-4 text-lg font-semibold">
                      {product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}
                    </h3>
                    <p
                      className="text-sm text-gray-500 mt-2"
                      dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                    />
                    {product.__typename === "SimpleProduct" && (
                      <p className="mt-3 font-bold text-lg price-font">D {product.price}</p>
                    )}
                    {product.__typename === "VariableProduct" && firstVariation && (
                      <div className="mt-3 text-center">
                        <p className="font-bold text-lg price-font">
                          D <span className="font-geograph-md">{displayPrice}</span>
                        </p>
                        {/* <p className="text-sm text-gray-700">
                          Variant: {firstVariation.name}
                        </p> */}
                      </div>
                    )}
                  </div>
                  <div className="flex mt-3 px-3 w-full gap-2">
                    {product.attributes?.nodes
                      ?.filter((attr) => attr.name === "pa_color")
                      ?.flatMap((attr) => attr.options)
                      ?.map((color, index) => (
                        <span
                          key={index}
                          className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
                          style={{ backgroundColor: colorMap[color] || "#ccc" }}
                          title={color}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/shop?bestsellers=true"
            className="text-center bg-black text-white px-10 py-3 rounded-full uppercase border border-white  hover:bg-white hover:text-black transition duration-200 ease-in  cursor-pointer hover:border hover:border-black "
          >
            Shop Best Seller
          </Link>
        </section>

        <BeforeFooter />
      </Layout>
    </>
  );
};

export default Home;