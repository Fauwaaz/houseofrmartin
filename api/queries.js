import { gql } from "@apollo/client";

const GET_ALL_PRODUCTS = gql`
  query Products {
    products {
      nodes {
        name
      }
    }
  }
`;
export { GET_ALL_PRODUCTS };
