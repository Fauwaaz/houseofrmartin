import React from "react";
import { GET_PRODUCT_DETAILS, GET_SLUG } from "../../api/queries";
import client from "../../libs/apollo";

const ProductDetails = ({ product }) => {
  // const [slideImage, setSlideImage] = useState(0);
  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const { onAdd, qty } = useStateContext();
  // const [product, setProduct] = useState(item);

  // useEffect(() => {
  //   if (product.price) {
  //     // Replacing the default price from comma to dot
  //     let removeComa = product.price.toString().replace(",", ".");
  //     // Parsing the number from String to Number
  //     let parsedPrice = parseFloat(removeComa);
  //     // Updating the queried project with the Parsed Price
  //     setProduct({
  //       ...product,
  //       price: parsedPrice,
  //     });
  //   }
  // }, [item, product]);

  // const galleryImages = product.galleryImages.nodes;

  // const selectImage = (i) => {
  //   setSlideImage(i);
  //   setSelectedIndex(i);
  // };

  // const handleBuyButton = (e) => {};

  // const handleAddToCart = () => {
  //   onAdd(product, qty)
  //   setShowCart(true)
  // }
  console.log(product);
  return (
    <div className="layout-pt">
      <h2>product</h2>
    </div>
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
      product: data.product,
    },
  };
};
