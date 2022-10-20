import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../api/queries";
import { Layout } from "../../components";
import { useStateContext } from "../../context/StateContext";
import client from "../../libs/apollo";
import styles from "../../styles/ProductDetails.module.css";

const ProductDetails = ({ item }) => {
  const [isMounted, setMount] = useState(false);
  const [product, setProduct] = useState(item);
  const [slideImage, setSlideImage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { onAdd, qty } = useStateContext();

  const selectImage = (i) => {
    setSlideImage(i);
    setSelectedIndex(i);
  };

  const handleBuyButton = (e) => {};

  // const handleAddToCart = () => {
  //   onAdd(product, qty)
  //   setShowCart(true)
  // }

  useEffect(() => {
    if (product.price) {
      setProduct({
        ...product,
        price: parseFloat(product.price),
      });
    }
    setMount(true);
  }, []);

  console.log(product);

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={styles.wrapper}>
          <section className={styles.left}>
            <div className={styles.featured}>
              <Image
                key={slideImage}
                src={product.galleryImages.nodes[slideImage].sourceUrl}
                priority
                layout="fill"
                objectFit="contain"
              />
            </div>
            <ol className={styles.gallery}>
              {product.galleryImages.nodes.map((image, i) => (
                <li
                  key={i}
                  slide={i}
                  className={
                    i === selectedIndex
                      ? `${styles.gallery_image_selected}`
                      : `${styles.gallery_image_not_selected}`
                  }
                >
                  <button
                    onClick={() => selectImage(i)}
                    slide={i}
                    className={styles.gallery_image}
                  >
                    <Image
                      key={i}
                      src={image.sourceUrl}
                      priority
                      layout="fill"
                      objectFit="cover"
                    />
                  </button>
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.right}>
            <h2 className={styles.name}>{product.name}</h2>
            {isMounted ? (
              <p
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              "Loading..."
            )}

            <span className={styles.price}>${product.price}</span>
            <div className={styles.quantity}>
              <button
                className={`${styles.button} ${styles.white_button}`}
                onClick={() => onAdd(product, qty)}
              >
                Add to cart
              </button>
              <button
                className={`${styles.button} ${styles.dark_button}`}
                onClick={handleBuyButton}
              >
                Buy now
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

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
  };
};
