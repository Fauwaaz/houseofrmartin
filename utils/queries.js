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

// 2. Get Page Slugs Only
const GET_PAGE_SLUGS = gql`
  query PageSlugs {
    pages {
      nodes {
        slug
      }
    }
  }
`;

// 3. Get Page Details by Slug
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
    products {
      nodes {
        id
        name
        slug
        ... on SimpleProduct {
          price(format: RAW)
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
        }
        ... on VariableProduct {
          price(format: RAW)
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
          variations {
            nodes {
              id
              name
              price(format: RAW)
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
      }
    }
  }
`;


const GET_SLUG = gql`
  query GetProductSlugs {
    products(first: 100) {
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
      name
      description

      ... on SimpleProduct {
        price(format: RAW)
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
            options
          }
        }
      }

      ... on VariableProduct {
        price(format: RAW)
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
            options
          }
        }
        variations {
          nodes {
            id
            name
            price(format: RAW)
            attributes {
              nodes {
                id
                name
                value
              }
            }
          }
        }
      }

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

export { GET_ALL_PAGES, GET_PAGE_SLUGS, GET_PAGE_DETAILS, GET_ALL, GET_SLUG, GET_PRODUCT_DETAILS, GET_postId };
