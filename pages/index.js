import { Layout, ProductCard } from "../components";
import client from "../libs/apollo";
import styles from "../styles/Home.module.css";
import { GET_ALL_PRODUCTS } from "../utils/queries";

const Home = ({ products }) => {
  return (
    <>
      <Layout>
        <section className={styles.product_cards_section}>
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
        </section>
      </Layout>
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_ALL_PRODUCTS,
  });

  return {
    props: {
      products: data.products.nodes,
    },
  };
}
