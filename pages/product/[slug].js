import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FeaturedAnimation } from "../../animations";
import { Layout } from "../../components";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import client from "../../libs/apollo";
import styles from "../../styles/ProductDetails.module.css";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../utils/queries";

export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: GET_SLUG,
  });

  const paths = data.products.nodes.map((product) => ({
    params: {
      slug: product.slug,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const { data } = await client.query({
    query: GET_PRODUCT_DETAILS(slug),
  });

  return {
    props: {
      item: data.product,
    },
    revalidate: 1,
  };
};

const ProductDetails = ({ item }) => {
  const [isMounted, setMount] = useState(false);
  const [product, setProduct] = useState(item);
  const [slideImage, setSlideImage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      <div className={styles.layout}>
        <div className={styles.wrapper}>
          <section className={styles.left}>
            <div className={styles.featured}>
              <motion.div
                key={slideImage}
                className={styles.featuredInner}
                variants={FeaturedAnimation}
                initial="initial"
                animate="animate"
              >
                <Image
                  alt={product.name}
                  src={product.galleryImages.nodes[slideImage]?.sourceUrl || '/placeholder.jpg'}
                  priority
                  layout="fill"
                  objectFit="contain"
                />
              </motion.div>
            </div>
            <Gallery
              product={product}
              selectedIndex={selectedIndex}
              setSlideImage={setSlideImage}
              setSelectedIndex={setSelectedIndex}
            />
          </section>
          <section className={styles.right}>
            <ProductInfo product={product} isMounted={isMounted} />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
