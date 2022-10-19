import { gql } from "@apollo/client";

const GET_ALL_PRODUCTS = gql`
  query Products {
    products {
      nodes {
        ... on SimpleProduct {
          name
          price(format: RAW)
          name
          id
          sku
          slug
          shortDescription
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

const GET_SLUG = gql`
  query Products {
    products {
      nodes {
        ... on SimpleProduct {
          slug
        }
      }
    }
  }
`;

const GET_PRODUCT_DETAILS = (slug) => {
  const getProductDetails = gql`
  query Product {
    product(id: "${slug}", idType: SLUG) {
      ... on SimpleProduct {
        id
        name
        description
        price(format: RAW)
        uri
        galleryImages {
          nodes {
            sourceUrl
          }
        }
      }
    }
  }
`;

  return getProductDetails;
};

export { GET_ALL_PRODUCTS, GET_SLUG, GET_PRODUCT_DETAILS };
