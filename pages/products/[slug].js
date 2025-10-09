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

  const handleVariantChange = (variant) => {
    if (!variant) return;

    const newFeatured = variant.image?.sourceUrl
      ? { node: { sourceUrl: variant.image.sourceUrl } }
      : product.featuredImage;

    // Prefer variant gallery images if available (if your API provides them)
    const newGallery = variant.galleryImages?.nodes?.length
      ? variant.galleryImages
      : product.galleryImages;

    // Update product images
    setProduct((prev) => ({
      ...prev,
      featuredImage: newFeatured,
      galleryImages: newGallery,
    }));

    // Reset the gallery to the first image
    setSlideImage(0);
    setSelectedIndex(0);
  };

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
      <div className="mt-[105px] lg:mt-[60px]">
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Gallery
              product={product}
              selectedIndex={selectedIndex}
              setSlideImage={setSlideImage}
              setSelectedIndex={setSelectedIndex}
            />
            <div className="relative w-full">
              <div
                className={styles.featured}
              >
                <motion.div
                  key={product.featuredImage?.node?.sourceUrl || "placeholder"}
                  className={styles.featuredInner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
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
                    className="object-cover rounded-[20px]"
                    unoptimized
                  />
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
                      (slideImage - 1 + product.galleryImages?.nodes.length) %
                      product.galleryImages?.nodes.length
                    )
                  }
                  className="absolute left-1 top-[220px] lg:top-[350px] -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800 cursor-pointer"
                >
                  <ArrowLeft size={22} color="white" />
                </button>

                <button
                  onClick={() =>
                    setSlideImage(
                      (slideImage + 1) % product.galleryImages?.nodes.length
                    )
                  }
                  className="absolute right-1 top-[220px] lg:top-[350px] -translate-y-1/2 bg-black/80 p-2 rounded-full shadow hover:bg-gray-800 cursor-pointer"
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
              />
            </Suspense>
          </div>
        </div>

        <div className="pb-6">
          <h2 className="text-3xl text-center">You may also like</h2>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;