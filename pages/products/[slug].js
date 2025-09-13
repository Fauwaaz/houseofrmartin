import { motion } from "framer-motion";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { Layout } from "../../components";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import client from "../../libs/apollo";
import styles from "../../styles/ProductDetails.module.css";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../utils/queries";
import ProductInfoSkeleton from "../../components/ProductInfoSkeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Head from "next/head";

export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: GET_SLUG,
  });

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
};

export const getStaticProps = async ({ params: { slug } }) => {
  const { data } = await client.query({
    query: GET_PRODUCT_DETAILS(slug),
  });

  if (!data?.product) {
    return {
      notFound: true, // show 404 if no product
    };
  }

  return {
    props: {
      item: data.product,
    },
    revalidate: 60, // increase from 1 sec to reduce load
  };
};




const ProductDetails = ({ item }) => {
  const [isMounted, setMount] = useState(false);
  const [product, setProduct] = useState(item);
  const [slideImage, setSlideImage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (product.price) {
      setProduct({
        ...product,
        price: parseFloat(product.price),
      });
    }
    setMount(true);
  }, []);

  const seo = product?.seo || {};

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 100; // -50 to +50
    const y = ((e.clientY - top) / height - 0.5) * 100; // -50 to +50
    setPosition({ x: -x, y: -y });
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

  return (
    <Layout>
      <Head>
        <title>{seo.title || product.name}</title>
        <meta name="description" content={seo.metaDesc || product.description?.slice(0, 155)} />
        {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}

        {/* OpenGraph tags */}
        <meta property="og:title" content={seo.title || product.name} />
        <meta property="og:description" content={seo.metaDesc || product.description?.slice(0, 155)} />
        <meta property="og:image" content={seo.opengraphImage?.sourceUrl || product.featuredImage?.node?.sourceUrl} />
      </Head>
      <div className="mt-[60px]">
        <div className={styles.wrapper}>
          <section className={styles.left}>
            <Gallery
              product={product}
              selectedIndex={selectedIndex}
              setSlideImage={setSlideImage}
              setSelectedIndex={setSelectedIndex}
            />
            <div className="relative w-full">
              <div
                className={styles.featured}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => {
                  setIsZoomed(false);
                  setPosition({ x: 0, y: 0 });
                }}
                onMouseMove={handleMouseMove}
              >
                <motion.div
                  key={slideImage}
                  className={styles.featuredInner}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <Image
                    alt={product.name}
                    src={
                      product.galleryImages?.nodes[slideImage]?.sourceUrl ||
                      product.featuredImage?.node?.sourceUrl ||
                      "/placeholder.jpg"
                    }
                    priority
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              </div>

              <button
                onClick={() =>
                  setSlideImage(
                    (slideImage - 1 + product.galleryImages?.nodes.length) %
                    product.galleryImages?.nodes.length
                  )
                }
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800"
              >
                <ArrowLeft size={22} color="white" />
              </button>

              <button
                onClick={() =>
                  setSlideImage(
                    (slideImage + 1) % product.galleryImages?.nodes.length
                  )
                }
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800"
              >
                <ArrowRight size={22} color="white" />
              </button>
            </div>

          </section>
          <section className={styles.right}>
            <Suspense fallback={<ProductInfoSkeleton />}>
              <ProductInfo product={product} isMounted={isMounted} />
            </Suspense>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;