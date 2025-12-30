import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import Head from "next/head";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Layout } from "../../components";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import ProductInfoSkeleton from "../../components/ProductInfoSkeleton";
import Popup from "../../components/common/Popup";
// import ComingPopup from "../../components/common/ComingPopup";

import client from "../../libs/apollo";
import styles from "../../styles/ProductDetails.module.css";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../utils/queries";
import { pushEvent } from "../../utils/dataLayer";
import { EVENT_TYPES } from "../../utils/dataLayerEvents";
import { createEventPayloads } from "../../utils/dataLayerPayloads";
import CompleteTheOutfit from "../../components/common/CompleteTheOutfit";

export const getStaticPaths = async () => {
  try {
    const { data } = await client.query({ query: GET_SLUG });
    const paths =
      data?.products?.nodes
        ?.filter((product) => product?.slug)
        .map((product) => ({
          params: { slug: String(product.slug) },
        })) || [];
    return {
      paths,
      fallback: "blocking",
    };
  } catch (err) {
    console.error("Error fetching slugs:", err);
    return { paths: [], fallback: "blocking" };
  }
};


export const getStaticProps = async ({ params: { slug } }) => {
  try {
    const { data } = await client.query({ query: GET_PRODUCT_DETAILS(slug) });
    if (!data?.product) {
      return { notFound: true };
    }
    return {
      props: { item: data.product },
      revalidate: 60,
    };
  } catch (err) {
    console.error("Error fetching product details:", err);
    return { notFound: true };
  }
};

const getWeeklyRandomNumber = (key, min, max) => {
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const storageKey = `${key}-week-${week}`;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(storageKey);
    if (stored) return parseInt(stored, 10);
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    localStorage.setItem(storageKey, random);
    return random;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ProductDetails = ({ item, products }) => {
  const [isMounted, setMount] = useState(false);
  const [product, setProduct] = useState(item);
  const [slideImage, setSlideImage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [soldCount, setSoldCount] = useState(0);
  const [colorCount, setColorCount] = useState(0);
  const [activeLine, setActiveLine] = useState(0);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev === 0 ? 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (product) {
      const variations = product?.variations?.nodes || [];
      const colorValues = variations
        .map(
          (v) =>
            v.attributes?.nodes
              ?.filter(
                (attr) =>
                  attr?.name?.toLowerCase?.() === "pa_color" ||
                  attr?.name?.toLowerCase?.() === "color"
              )
              ?.map((attr) => attr?.value?.trim())
        )
        .flat()
        .filter(Boolean);

      const uniqueColors = [
        ...new Set(colorValues.map((c) => c.toLowerCase())),
      ];
      const totalColors = uniqueColors.length;
      const randomSold = getWeeklyRandomNumber(product.id, 20, 200);
      setColorCount(totalColors);
      setSoldCount(randomSold);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  useEffect(() => {
    if (product.price) {
      setProduct({
        ...product,
        price: parseFloat(product.price),
      });
    }
    setMount(true);
  }, []);

  useEffect(() => {
    pushEvent(
      EVENT_TYPES.VIEW_ITEM,
      createEventPayloads.viewItem(product)
    );
  });

  const mergedGallery = (() => {
    const featured = product?.featuredImage?.node?.sourceUrl
      ? [{ sourceUrl: product.featuredImage.node.sourceUrl }]
      : [];
    const gallery = product?.galleryImages?.nodes || [];
    const uniqueImages = [...featured, ...gallery].filter(
      (img, i, arr) =>
        img?.sourceUrl &&
        arr.findIndex((x) => x.sourceUrl === img.sourceUrl) === i
    );
    // If duplicate still appears at start, slice one
    if (
      uniqueImages.length > 1 &&
      uniqueImages[0].sourceUrl === uniqueImages[1].sourceUrl
    ) {
      return uniqueImages.slice(1);
    }
    return uniqueImages;
  })();

  const lastVariantRef = useRef(null);
  const handleVariantChange = async (variant) => {
    if (!variant) return;
    if (lastVariantRef.current?.id === variant.id) return;
    lastVariantRef.current = variant;

    setIsGalleryLoading(true);

    const newFeatured = variant.image?.sourceUrl
      ? { node: { sourceUrl: variant.image.sourceUrl } }
      : product.featuredImage;

    const meta = variant.metaData?.find((m) => m.key === "rtwpvg_images");
    let newGallery = product.galleryImages;

    if (meta?.value) {
      try {
        const ids = JSON.parse(meta.value);
        // ✅ Fetch all variant images in parallel
        const urls = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/custom/v1/image/${id}`
              );
              const data = await res.json();
              return data.url;
            } catch {
              return null;
            }
          })
        );

        const validUrls = urls
          .filter(Boolean)
          .map((url) => ({ sourceUrl: url }));
        if (validUrls.length) newGallery = { nodes: validUrls };
      } catch (e) {
        console.error("Error parsing rtwpvg_images meta:", e);
      }
    }

    // Preload new images
    await Promise.all(
      newGallery.nodes.map(
        (img) =>
          new Promise((resolve) => {
            const image = new window.Image();
            image.src = img.sourceUrl;
            image.onload = resolve;
            image.onerror = resolve;
          })
      )
    );

    setProduct((prev) => ({
      ...prev,
      featuredImage: newFeatured,
      galleryImages: newGallery,
    }));
    setSlideImage(0);
    setSelectedIndex(0);

    // 🟢 Hide shimmer once done
    setTimeout(() => setIsGalleryLoading(false), 200);
  };

  const seo = product?.seo || {};

  const OUTFIT_MAP = {
    shirts: ["pants", "trousers"],
    "t-shirts": ["pants", "trousers"],
    pants: ["shirts", "t-shirts"],
    trousers: ["shirts", "t-shirts"],
  };


  const currentCategories =
    item?.productCategories?.nodes?.map((c) => c.slug) || [];

  const currentProductId = item?.databaseId;


  return (
    <Layout>
      <Head>
        <title>{seo.title || product.name}</title>
        <meta
          name="description"
          content={seo.metaDesc || product.shortDescription?.slice(0, 155)}
        />
        {seo.metaKeywords && (
          <meta name="keywords" content={seo.metaKeywords} />
        )}
        <meta property="og:title" content={seo.title || product.name} />
        <meta
          property="og:description"
          content={seo.metaDesc || product.shortDescription?.slice(0, 155)}
        />
        <meta
          property="og:image"
          content={
            seo.opengraphImage?.sourceUrl ||
            product.featuredImage?.node?.sourceUrl
          }
        />
      </Head>
      {/* <ComingPopup /> */}
      {/* <Popup /> */}
      <div className="mt-[110px] lg:mt-[50px]">
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Gallery
              key={
                product?.galleryImages?.nodes
                  ?.map((img) => img.sourceUrl)
                  .join(",") || product.id
              }
              product={product}
              selectedIndex={selectedIndex}
              setSlideImage={setSlideImage}
              setSelectedIndex={setSelectedIndex}
              isGalleryLoading={isGalleryLoading}
            />
            <div className="relative w-full max-w-[500px]">
              <div className={styles.featured}>
                <motion.div
                  key={slideImage}
                  className={`${styles.featuredInner} relative overflow-hidden rounded-[20px]`}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden cursor-zoom-in bg-gray-200 rounded-[20px]"
                    onMouseMove={(e) => handleMouseMove(e)}
                    onMouseLeave={() => setZoom({ active: false })}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x =
                        ((touch.clientX - rect.left) / rect.width) * 100;
                      const y =
                        ((touch.clientY - rect.top) / rect.height) * 100;
                      setZoom({ active: true, x, y });
                    }}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x =
                        ((touch.clientX - rect.left) / rect.width) * 100;
                      const y =
                        ((touch.clientY - rect.top) / rect.height) * 100;
                      setZoom({ active: true, x, y });
                    }}
                    onTouchEnd={() => setZoom({ active: false, x: 50, y: 50 })}
                  >
                    {(isGalleryLoading || !imageLoaded) && (
                      <div className="absolute inset-0 rounded-[20px] overflow-hidden bg-gray-300 z-10">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 opacity-60"
                          initial={{ x: "-150%", y: "-150%" }}
                          animate={{ x: "150%", y: "150%" }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 70%)",
                            mixBlendMode: "overlay",
                          }}
                        />
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{
                        opacity: imageLoaded && !isGalleryLoading ? 1 : 0,
                        scale: 1,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative w-full h-full rounded-[20px]"
                    >
                      <Image
                        alt={product.name}
                        src={
                          mergedGallery[slideImage]?.sourceUrl ||
                          product.featuredImage?.node?.sourceUrl ||
                          "/placeholder.jpg"
                        }
                        fill
                        priority
                        className="object-cover object-top rounded-[20px]"
                        unoptimized
                        fetchPriority="high"
                        quality={100}
                        onLoadingComplete={() => setImageLoaded(true)}
                      />
                      <div className="text-center bg-black absolute w-full bottom-0 shadow-inner">
                        <div className="mt-2 text-center overflow-hidden h-[25px]">
                          <AnimatePresence mode="wait">
                            {activeLine === 0 ? (
                              <motion.p
                                key="colors-line"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="text-xs text-white/80"
                              >
                                COMES IN{" "}
                                <strong className="text-yellow-500">
                                  {colorCount}
                                </strong>{" "}
                                {colorCount < 2
                                  ? "COLOR"
                                  : "DIFFERENT COLORS"}
                              </motion.p>
                            ) : (
                              <motion.p
                                key="sold-line"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="text-xs text-white/80"
                              >
                                <strong className="text-yellow-500">
                                  {soldCount}
                                </strong>{" "}
                                PEOPLE VIEWED THIS PRODUCT IN LAST 7 DAYS
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                    {zoom.active && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        }}
                        animate={{ scale: 2 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                      >
                        <Image
                          alt={product.name}
                          src={
                            mergedGallery[slideImage]?.sourceUrl ||
                            product.featuredImage?.node?.sourceUrl ||
                            "/placeholder.jpg"
                          }
                          fill
                          unoptimized
                          className="object-cover rounded-[20px]"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                {product.productTags?.nodes?.length > 0 && (
                  <div className="bg-black/70 px-4 py-2 text-[12px] lg:text-sm text-white text-center absolute z-10 uppercase rounded-2xl top-2 left-2">
                    {product.productTags.nodes[0].name}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() =>
                    setSlideImage(
                      (slideImage - 1 + mergedGallery.length) %
                      mergedGallery.length
                    )
                  }
                  className="absolute left-1 top-[220px] md:top-[350px] lg:top-[350px] -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800 cursor-pointer"
                >
                  <ArrowLeft size={22} color="white" />
                </button>
                <button
                  onClick={() =>
                    setSlideImage((slideImage + 1) % mergedGallery.length)
                  }
                  className="absolute right-1 top-[220px] md:top-[350px] lg:top-[350px] -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800 cursor-pointer"
                >
                  <ArrowRight size={22} color="white" />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <Suspense fallback={<ProductInfoSkeleton />}>
              <ProductInfo
                product={product}
                isMounted={isMounted}
                onVariantChange={handleVariantChange}
                productId={product.databaseId}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1600px]">
        <h3 className="text-center text-3xl">Frequently Bought Together</h3>
        <CompleteTheOutfit
          currentCategories={currentCategories}
          currentProductId={currentProductId}
        />
      </div>
    </Layout>
  );
};

export default ProductDetails;