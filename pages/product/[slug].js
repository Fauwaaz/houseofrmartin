import { motion } from "framer-motion";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { FeaturedAnimation } from "../../animations";
import { Layout } from "../../components";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import client from "../../libs/apollo";
import styles from "../../styles/ProductDetails.module.css";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../utils/queries";
import ProductInfoSkeleton from "../../components/ProductInfoSkeleton";

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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) *  100; // -50 to +50
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
      <div className="mt-[50px]">
        <div className={styles.wrapper}>
          <section className={styles.left}>
            <Gallery
              product={product}
              selectedIndex={selectedIndex}
              setSlideImage={setSlideImage}
              setSelectedIndex={setSelectedIndex}
            />
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
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={
                  isZoomed
                    ? { scale: 1.2, x: position.x, y: position.y }
                    : { scale: 1, x: 0, y: 0 }
                }
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