import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/Gallery.module.css";

const Gallery = ({
  product,
  setSlideImage,
  selectedIndex,
  setSelectedIndex,
  isGalleryLoading,
}) => {
  const selectImage = (i) => {
    setSlideImage(i);
    setSelectedIndex(i);
  };

  const images = [
    ...(product?.featuredImage?.node ? [product.featuredImage.node] : []),
    ...(product?.galleryImages?.nodes || []),
  ];

  const [loadedStates, setLoadedStates] = useState(images.map(() => false));

  useEffect(() => {
    setLoadedStates(images.map(() => false));
  }, [images.length]);

  useEffect(() => {
    if (loadedStates.every(Boolean)) {
      // optional callback for debugging
      // console.log("✅ All gallery thumbnails loaded");
    }
  }, [loadedStates]);

  return (
    <ol className={styles.gallery}>
      {images.map((image, i) => {
        const loaded = loadedStates[i];

        const handleImageLoad = () => {
          setLoadedStates((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        };

        const shouldShowShimmer = !loaded && isGalleryLoading !== false;

        return (
          <li
            key={i}
            slide={i}
            className={`relative rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 ${
              i === selectedIndex
                ? `${styles.gallery_image_selected} border-2 border-gray-700` // Assuming you meant to select the image here
                : "hover:border-black hover:border"
            }`}
          >
            <button
              onMouseEnter={() => selectImage(i)}
              slide={i}
              className={`${styles.gallery_image} relative w-full h-full`}
            >
              {/* ✅ Shimmer overlay */}
              {shouldShowShimmer && (
                <div className="absolute inset-0 bg-gray-300 overflow-hidden rounded-[12px] z-10">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400 opacity-90"
                    initial={{ x: "-150%", y: "-150%" }}
                    animate={{ x: "150%", y: "150%" }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ mixBlendMode: "lighten" }}
                  />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  alt={product?.name || "Product Image"}
                  src={image.sourceUrl}
                  priority={i === 0}
                  fill
                  fetchPriority="high"
                  className="object-cover object-top"
                  unoptimized
                  quality={100}
                  onLoad={handleImageLoad}
                  onLoadingComplete={handleImageLoad}
                />
              </motion.div>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default Gallery;