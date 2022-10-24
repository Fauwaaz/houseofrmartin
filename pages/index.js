import { Layout, ProductCard } from "../components";
import Banner from "../components/Banner";
import Hero from "../components/Hero";
import Services from "../components/Services";
import { useStateContext } from "../context/StateContext";
import client from "../libs/apollo";
import styles from "../styles/Home.module.css";
import { GET_ALL } from "../utils/queries";

const Home = ({ products, banner }) => {
  const { onAdd, qty } = useStateContext();

  return (
    <>
      <Layout>
        <section className={styles.content}>
          <Hero
            name={products[0].name}
            description={products[0].shortDescription}
            url={products[0].slug}
            image={products[0].featuredImage.node.sourceUrl}
            addToCart={() => onAdd(products[0], qty)}
          />
          <Services />
          <ul className={styles.product_cards}>
            {products.map((product, i) => (
              <ProductCard
                name={product.name}
                description={product.shortDescription}
                slug={product.slug}
                price={product.price}
                image={product.featuredImage.node.sourceUrl}
                key={i}
              />
            ))}
          </ul>
          <Banner
            title={banner.title}
            description={banner.description}
            uri={banner.uri}
            image={banner.image.sourceUrl}
          />
        </section>
      </Layout>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_ALL,
  });

  return {
    props: {
      products: data.products.nodes,
      banner: data.category.posts.nodes[0].banner,
    },
  };
}
