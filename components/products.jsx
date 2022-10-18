const Products = () => {
  // console.log(products);
  return (
    <div>
      <h2>Products</h2>
    </div>
  );
};

export default Products;

// export async function getStaticProps() {
//   const client = new ApolloClient({
//     uri: "https://nextecomwp.tk/graphql",
//     cache: new InMemoryCache(),
//   });

//   const { data } = await client.query({
//     query: gql`
//       query Products {
//         products {
//           nodes {
//             name
//           }
//         }
//       }
//     `,
//   });

//   console.log("data", data);

//   return {
//     props: {
//       products: data.products,
//     },
//   };
// }

// export async function getStaticProps() {
//   const res = await fetch("http://nextecomwp.tk/graphql", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: `
//         query Products {
//           products {
//             nodes {
//               name
//             }
//           }
//         }
//       `,
//     }),
//   });

//   const json = await res.json();

//   console.log(json);

//   return {
//     props: {
//       products: json.data,
//     },
//   };
// }
