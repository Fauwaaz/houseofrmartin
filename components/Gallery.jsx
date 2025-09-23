import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Gallery.module.css";

const Gallery = ({ product, setSlideImage, selectedIndex, setSelectedIndex }) => {
  const selectImage = (i) => {
    setSlideImage(i);
    setSelectedIndex(i);
  };

  const images = [
    ...(product?.featuredImage?.node ? [product.featuredImage.node] : []),
    ...(product?.galleryImages?.nodes || []),
  ];

  return (
    <ol className={styles.gallery}>
      {images.map((image, i) => {
        const [loaded, setLoaded] = useState(false);

        return (
          <li
            key={i}
            slide={i}
            className={
              i === selectedIndex
                ? styles.gallery_image_not_selected
                : `${styles.gallery_image_not_selected} hover:border-black hover:border-1`
            }
          >
            <button
              onMouseEnter={() => selectImage(i - 1)}
              slide={i}
              className={styles.gallery_image}
            >
              {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
              )}

              <Image
                alt={product?.name || "Product Image"}
                src={image.sourceUrl}
                priority={i === 0}
                className={`object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                fill
                unoptimized
                onLoadingComplete={() => setLoaded(true)}
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default Gallery;