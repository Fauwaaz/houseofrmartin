import { gql } from "@apollo/client";

const GET_ALL = gql`
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
    category(id: "Banners", idType: NAME) {
      id
      posts {
        nodes {
          id
          banner {
            title
            description
            uri
            image {
              id
              uri
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
        featuredImage {
          node {
            sourceUrl
          }
        }
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

const GET_BANNER = gql`
  query Banner {
    category(id: "Banners", idType: NAME) {
      id
      posts {
        nodes {
          id
          banner {
            title
            description
            uri
            image {
              id
              uri
            }
          }
        }
      }
    }
  }
`;

export { GET_ALL, GET_SLUG, GET_PRODUCT_DETAILS, GET_BANNER };
