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
        ... on SimpleProduct {
          id
          name
          slug
          sku
          price(format: RAW)
          shortDescription
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }

    category(id: "postId", idType: NAME) {
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

// 2. Get Slugs Only
const GET_SLUG = gql`
  query ProductSlugs {
    products {
      nodes {
        ... on SimpleProduct {
          slug
        }
      }
    }
  }
`;

// 3. Get Product Details by Slug
const GET_PRODUCT_DETAILS = (slug) => gql`
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

// 4. Get Category Posts (Standalone Query)
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
  