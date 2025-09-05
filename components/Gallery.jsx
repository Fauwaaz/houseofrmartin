import Image from "next/image";
import styles from "../styles/Gallery.module.css";

const Gallery = ({
  product,
  setSlideImage,
  selectedIndex,
  setSelectedIndex,
}) => {
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
      {images.map((image, i) => (
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
            <Image
              alt={product?.name || "Product Image"}
              src={image.sourceUrl}
              priority={i === 0}
              className="object-contain"
              fill
              unoptimized
            />
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Gallery;