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
import { Heart } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_ALL,
  });

  const products = data?.products?.nodes || [];

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
}

const getDiscountPercent = (regular, sale) => {
  if (!regular || !sale || parseFloat(regular) <= parseFloat(sale)) return null;
  return Math.round(((regular - sale) / regular * 100))
}


const Home = ({ products }) => {
  const { onAdd, qty } = useStateContext();
  const parentRef = useRef(null);
  const isInView = useInView(parentRef, { amount: 0.5, once: true }); 

  const categoriesSection = [
    { title: "Co-ord set", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/cord-set-scaled.jpg", link: "#" },
    { title: "Shirts", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/shirt-scaled.jpg", link: "#" },
    { title: "Pants", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/pant-scaled.jpg", link: "#" },
    { title: "Tshirts", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/t-shirt-scaled.jpg", link: "#" },
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
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-3 lg:grid-cols-4 mt-5 gap-3 h-[750px] lg:h-[600px] w-full max-w-1920 px-3 lg:px-6">
            {categoriesSection.map((category, index) => (
              <div
                key={index}
                className="h-full w-full bg-slate-700 rounded-[20px] flex flex-col items-center justify-center shadow-sm relative overflow-hidden hover:rounded-[55px] transition-all duration-500 ease-in-out"
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

        <section className="story-banner h-[500px] lg:min-h-screen bg-[url(/story/story-banner-bg.png)] bg-cover bg-no-repeat bg-center flex items-center justify-center w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center">
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

        <section className="py-10 w-full recents text-center flex flex-col items-center">
          <div>
            <h2 className="text-center uppercase text-4xl font-akkurat">
              Our Bestseller
            </h2>
            <p className="pt-1 text-sm lg:text-lg text-center">
              Don&apos;t Miss Out
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-1 lg:gap-3 px-3 lg:px-6 max-w-1920 my-10">
            {products.slice(0, 5).map((product) => {
              let displayPrice = null;
              let firstVariation = null;

              if (
                product.__typename === "VariableProduct" &&
                product.variations?.nodes?.length > 0
              ) {
                const sorted = [...product.variations.nodes].sort(
                  (a, b) => parseFloat(a.price) - parseFloat(b.price)
                );
                firstVariation = sorted[0];
                displayPrice = firstVariation.price;
              }

              return (
                <div
                  key={product.id}
                  className="bg-white shadow-sm rounded-md lg:rounded-[20px] flex flex-col items-center overflow-hidden pb-4 relative"
                >
                  {product.productTags?.nodes?.length > 0 && (
                    <div className="bg-black/70 px-4 py-2 text-[12px] lg:text-sm text-white text-center absolute rounded-2xl z-10 uppercase top-2 left-2">
                      {product.productTags.nodes[0].name}
                    </div>
                  )}

                  <div className="bg-white/40 pt-2 px-2 rounded-full absolute z-10 uppercase top-2 right-2">
                    <button>
                      <Heart />
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full relative group"
                  >
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

                  <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between px-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="mt-4 text-left text-sm lg:text-lg font-semibold">
                        {product.name.length > 35
                          ? product.name.substring(0, 35) + "..."
                          : product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.productCategories?.nodes?.[0]?.name || ""}</p>
                    </div>
                  </div>

                  <div className="mt-2 px-3 w-full">
                    {(() => {
                      const colors =
                        product.attributes?.nodes
                          ?.filter((attr) => attr.name === "pa_color")
                          ?.flatMap((attr) => attr.options) || [];

                      const limitedColors = colors.slice(0, 3);
                      const remaining = colors.length - 3;

                      return (
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex justify-center gap-2">
                            {limitedColors.map((color, index) => (
                              <span
                                key={index}
                                className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
                                style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                title={color}
                              />
                            ))}

                            {remaining > 0 && (
                              <span className="inline-flex -ml-1 items-center font-geograph-md underline justify-center w-5 h-5 text-sm text-black">
                                +{remaining}
                              </span>
                            )}
                          </div>

                          {product.__typename === "SimpleProduct" && (
                            <div className="text-center">
                              {product.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg font-bold price-font text-red-600">
                                    D {product.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {product.regularPrice}
                                  </p>
                                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                    {getDiscountPercent(product.regularPrice, product.salePrice)}% OFF
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {product.regularPrice}</p>
                              )}
                            </div>
                          )}
                          {product.__typename === "VariableProduct" && firstVariation && (
                            <div className="text-center flex items-center gap-1">
                              {firstVariation.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg price-font text-black">
                                    D {firstVariation.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {firstVariation.regularPrice}
                                  </p>
                                  <span className="text-sm text-red-500">
                                    ({getDiscountPercent(firstVariation.regularPrice, firstVariation.salePrice)}% OFF)
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {firstVariation.regularPrice}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              );
            })}
          </div>
          <Link
            href="/shop?bestsellers=true"
            className="text-center bg-black text-white px-10 py-3 rounded-full uppercase border border-white hover:bg-gray-800 cursor-pointer "
          >
            Shop Best Seller
          </Link>
        </section>

        <section className="10-years w-full py-6 px-5 max-w-1920">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-1920 overflow-hidden">
            <div
              ref={parentRef}
              className="grid grid-cols-2 h-[350px] lg:h-screen overflow-hidden"
            >
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/10-years-img-1.png)] bg-cover bg-no-repeat bg-center text-center p-2 flex items-end"
              >
                <button className="bg-black text-white w-full py-2">Shop Now</button>
              </motion.div>

              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/10-years-img-2.png)] bg-cover bg-no-repeat bg-top text-center p-2 flex items-end"
              >
                <button className="bg-black text-white w-full py-2">Shop Now</button>
              </motion.div>
            </div>
            <div className="bg-white w-full h-full">
              <div className="grid grid-cols-2 h-screen">
                <div className="pl-6 flex flex-col justify-center items-start">
                  <h3 className="uppercase font-akkurat text-xl lg:text-4xl">10 years of comfort</h3>
                  <p>Founded in 2020, House of RMartin has come a long way from its beginnings. When we first started out, our passion for fashion drove us to start our own business.</p>
                  <Link
                    href={'/about'}
                    className="text-white bg-black px-5 py-2 rounded-full mt-2 hover:bg-gray-800"
                  >
                    About Us
                  </Link>
                </div>
                <div className="bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/10-years-img-3.png)] bg-cover bg-no-repeat bg-center text-center p-2 flex items-end">
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="products-showcase">
          <div className="inline-block space-x-10 lg:space-x-20 w-full recents text-center">
            <p className="text-sm lg:text-lg text-center font-akkurat underline">
              SALE
            </p>
            <p className="text-sm lg:text-lg text-center font-akkurat">
              FEATURED
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 px-3 lg:px-6 max-w-1920 my-10">
            {products.slice(0, 5).map((product) => {
              let displayPrice = null;
              let firstVariation = null;

              if (
                product.__typename === "VariableProduct" &&
                product.variations?.nodes?.length > 0
              ) {
                const sorted = [...product.variations.nodes].sort(
                  (a, b) => parseFloat(a.price) - parseFloat(b.price)
                );
                firstVariation = sorted[0];
                displayPrice = firstVariation.price;
              }

              return (
                <div
                  key={product.id}
                  className="bg-white shadow-sm rounded-md lg:rounded-[20px] flex flex-col items-center overflow-hidden pb-4 relative"
                >
                  {product.productTags?.nodes?.length > 0 && (
                    <div className="bg-black/70 px-4 py-2 text-[12px] lg:text-sm text-white text-center absolute rounded-2xl z-10 uppercase top-2 left-2">
                      {product.productTags.nodes[0].name}
                    </div>
                  )}

                  <div className="bg-white/40 pt-2 px-2 rounded-full absolute z-10 uppercase top-2 right-2">
                    <button>
                      <Heart />
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full relative group"
                  >
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

                  <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between px-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="mt-4 text-left text-sm lg:text-lg font-semibold">
                        {product.name.length > 35
                          ? product.name.substring(0, 35) + "..."
                          : product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.productCategories?.nodes?.[0]?.name || ""}</p>
                    </div>
                  </div>

                  <div className="mt-2 px-3 w-full">
                    {(() => {
                      const colors =
                        product.attributes?.nodes
                          ?.filter((attr) => attr.name === "pa_color")
                          ?.flatMap((attr) => attr.options) || [];

                      const limitedColors = colors.slice(0, 3);
                      const remaining = colors.length - 3;

                      return (
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex justify-center gap-2">
                            {limitedColors.map((color, index) => (
                              <span
                                key={index}
                                className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
                                style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                title={color}
                              />
                            ))}

                            {remaining > 0 && (
                              <span className="inline-flex -ml-1 items-center font-geograph-md underline justify-center w-5 h-5 text-sm text-black">
                                +{remaining}
                              </span>
                            )}
                          </div>

                          {product.__typename === "SimpleProduct" && (
                            <div className="text-center">
                              {product.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg font-bold price-font text-red-600">
                                    D {product.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {product.regularPrice}
                                  </p>
                                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                    {getDiscountPercent(product.regularPrice, product.salePrice)}% OFF
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {product.regularPrice}</p>
                              )}
                            </div>
                          )}
                          {product.__typename === "VariableProduct" && firstVariation && (
                            <div className="text-center flex items-center gap-1">
                              {firstVariation.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg price-font text-black">
                                    D {firstVariation.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {firstVariation.regularPrice}
                                  </p>
                                  <span className="text-sm text-red-500">
                                    ({getDiscountPercent(firstVariation.regularPrice, firstVariation.salePrice)}% OFF)
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {firstVariation.regularPrice}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        <BeforeFooter />
      </Layout>
    </>
  );
};

export default Home;