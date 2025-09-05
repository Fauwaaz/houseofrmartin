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
  return (
    <ol className={styles.gallery}>
      {product.galleryImages?.nodes.map((image, i) => (
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
            onMouseEnter={() => selectImage(i)}
            slide={i}
            className={styles.gallery_image}
          >
            <Image
              alt={i}
              key={i}
              src={image.sourceUrl}
              priority
              className="object-cover"
              fill
            />
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Gallery;
