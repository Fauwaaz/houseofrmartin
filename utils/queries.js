import { gql } from "@apollo/client";

const GET_ALL_PAGES = gql`
  query AllPages {
    pages {
      nodes {
        id
        title
        slug
        uri
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

const GET_CURRENT_USER = gql`
  query Viewer {
    viewer {
      id
      name
      email
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      status
    }
  }
`;

const GET_PAGE_SLUGS = gql`
  query PageSlugs {
    pages {
      nodes {
        slug
      }
    }
  }
`;

const GET_PAGE_DETAILS = (slug) => gql`
  query PageDetails {
    page(id: "${slug}", idType: SLUG) {
      id
      title
      slug
      uri
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

const GET_ALL = gql`
  query Products {
    products(
    first: 1000
    where: {
      status: "publish"
    }
  ) {
      nodes {
        id
        name
        slug
        ... on SimpleProduct {
          price(format: RAW)
          salePrice(format: RAW)
        regularPrice(format: RAW)
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
          attributes {
            nodes {
              id
              name
              label
              options
            }
          }
          productCategories {
            nodes {
              id
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          price(format: RAW)
          salePrice(format: RAW)
          regularPrice(format: RAW)
          featuredImage {
            node {
              sourceUrl
            }
          }
          productTags {
          nodes {
            id
            name
            slug
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          attributes {  
            nodes {
              id
              name
              label
              options
            }
          }
          variations {
            nodes {
              id
              name
              price(format: RAW)
              regularPrice(format: RAW)
              salePrice(format: RAW)
              sku
              attributes {
                nodes {
                  id
                  name
                  label
                  value
                }
              }
            }
          }
        }
        averageRating
        reviewCount
      }
    }
  }
`;

const GET_SLUG = gql`
  query GetProductSlugs {
    products(first: 200) {
      nodes {
        slug
      }
    }
  }
`;

const GET_PRODUCT_DETAILS = (slug) => gql`
  query GetProductDetails {
    product(id: "${slug}", idType: SLUG) {
      id
      databaseId
      name
      description
      slug
      seo {
        title
        metaDesc
        metaKeywords
        opengraphImage {
          sourceUrl
        }
      }
        productTags {
          nodes {
            id
            name
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }

      ... on SimpleProduct {
        price(format: RAW)
        salePrice(format: RAW)
        regularPrice(format: RAW)
        featuredImage {
          node {
            sourceUrl
          }
        }
        productTags {
          nodes {
            id
            name
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        attributes {
          nodes {
            id
            name
            options
          }
        }
      }

      ... on VariableProduct {
        price(format: RAW)
        salePrice(format: RAW)
        regularPrice(format: RAW)
        featuredImage {
          node {
            sourceUrl
          }
        }
        productTags {
          nodes {
            id
            name
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        attributes {
          nodes {
            id
            name
            options
          }
        }
        variations(first: 200) {
          nodes {
            id
            name
            image {
              sourceUrl
            }
            sku
            attributes {
              nodes {
                name
                value
              }
            }
            metaData {
              key
              value
            }
            stockQuantity
            stockStatus
            manageStock
          }
        }
       comments {
          nodes {
            id
            content
            date
            author {
              name
              email
            }
          }
        }
      }
      averageRating

      ... on ExternalProduct {
        price(format: RAW)
        featuredImage {
          node {
            sourceUrl
          }
        }
      }

      ... on GroupProduct {
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      shortDescription
    }
  }
`;

const GET_postId = gql`
    query CategoryPosts {
      category(id: "postIds", idType: NAME) {
        id
        name
        posts {
          nodes {
            id
            title
            excerpt
            uri
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

const GET_ALL_REVIEWS = gql`
  query GetProductReviews($slug: [String!]) {
    products(where: { slugIn: $slug }) {
      nodes {
        id
        name
        reviewCount
        comments {
          nodes {
            content
            date
            author {
              name
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS_BY_CATEGORY = gql`
  query ProductsByCategory($slugs: [String!]!) {
    products(
      first: 8
      where: {
        categoryIn: $slugs
        status: PUBLISH
      }
    ) {
      nodes {
        id
        name
        slug
        __typename

        featuredImage {
          node {
            sourceUrl
          }
        }

        productCategories {
          nodes {
            slug
          }
        }

        ... on SimpleProduct {
          price(format: RAW)
          salePrice(format: RAW)
          regularPrice(format: RAW)
        }

        ... on VariableProduct {
          price(format: RAW)
          salePrice(format: RAW)
          regularPrice(format: RAW)
          variations(first: 1) {
            nodes {
              price(format: RAW)
              regularPrice(format: RAW)
              salePrice(format: RAW)
            }
          }
        }

        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
`;

export { GET_ALL_PAGES, GET_PAGE_SLUGS, GET_PAGE_DETAILS, GET_ALL, GET_SLUG, GET_PRODUCT_DETAILS, GET_postId, GET_CURRENT_USER, LOGOUT, GET_ALL_REVIEWS, GET_PRODUCTS_BY_CATEGORY };
