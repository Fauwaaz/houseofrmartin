import { Layout } from "../../components";
import { useStateContext } from "../../context/StateContext";
import client from "../../libs/apollo";
import Image from "next/image";
import Link from "next/link";
import { GET_ALL } from "../../utils/queries";
import { colorMap } from "../../utils/data";
import Filter from "../../components/common/Filter";
import { useState } from "react";
import { Heart } from "lucide-react";

export async function getStaticProps() {
  const { data } = await client.query({ query: GET_ALL });
  const products = data?.products?.nodes || [];

  return {
    props: { products },
    revalidate: 1,
  };
}

const getDiscountPercent = (regular, sale) => {
  if (!regular || !sale || parseFloat(regular) <= parseFloat(sale)) return null;
  return Math.round(((regular - sale) / regular * 100))
}

const Products = ({ products }) => {
  const { onAdd, qty } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // Derived pagination values
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination handlers
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleColorSelect = (colors) => {
    if (colors.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.attributes?.nodes?.some(
          (attr) =>
            attr.name === "pa_color" &&
            attr.options.some((opt) => colors.includes(opt))
        )
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSizeSelect = (size) => {
    if (size.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.attributes?.nodes?.some(
          (attr) =>
            attr.name === "pa_size" &&
            attr.options.some((opt) => size.includes(opt))
        )
      );
      setFilteredProducts(filtered);
    }
  }

  const handleCategorySelect = (categories) => {
    if (categories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productCategories?.nodes?.some((cat) =>
          categories.includes(cat.name)
        )
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <Layout>
      <div className="mt-[130px] lg:mt-[120px] w-full">
        <div className="flex flex-col gap-2 items-center justify-center pb-6">
          <h1 className="text-xl lg:text-3xl">Shop All</h1>
          <p className="text-center px-4">
            Shop all our designs in one place and discover the full story of R-Martin.
          </p>
        </div>

        {/* Filter Bar - pass props */}
        <Filter
          products={products}
          setFilteredProducts={setFilteredProducts}
          setLoading={setLoading}
          onColorSelect={handleColorSelect}
          onSizeSelect={handleSizeSelect}
          onCategorySelect={handleCategorySelect}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 px-3 lg:px-6 mb-10">
          {loading ? (
            <p className="col-span-full text-center min-h-screen">Loading...</p>
          ) : (
            currentProducts.map((product) => {
              let displayPrice = null;
              let firstVariation = null;

              if (
                product.__typename === "VariableProduct" &&
                product.variations?.nodes?.length > 0
              ) {
                const sorted = [...product.variations.nodes].sort(
                  (a, b) => parseFloat(a.price) - parseFloat(b.price)
                );
                firstVariation = sorted[0];
                displayPrice = firstVariation.price;
              }

              return (
                <div
                  key={product.id}
                  className="bg-white shadow-sm rounded-[10px] flex flex-col items-center overflow-hidden pb-4 relative"
                >
                  {product.productTags?.nodes?.length > 0 && (
                    <div className="bg-black/70 px-4 py-2 text-[10px] lg:text-[12px] text-white text-center absolute rounded-2xl z-10 uppercase top-2 left-2">
                      {product.productTags.nodes[0].name}
                    </div>
                  )}

                  <div className="bg-white/40 pt-2 px-2 rounded-full absolute z-10 uppercase top-2 right-2">
                    <button>
                      <Heart />
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full relative group"
                  >
                    <Image
                      src={product.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                      alt={product.name}
                      width={600}
                      height={300}
                      className="object-cover max-h-[480px] transition-opacity duration-300 group-hover:opacity-0"
                    />

                    {product.galleryImages?.nodes?.length > 0 && (
                      <Image
                        src={product.galleryImages.nodes[0].sourceUrl}
                        alt={`${product.name} gallery`}
                        width={600}
                        height={300}
                        className="object-cover absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    )}
                  </Link>

                  <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between px-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="mt-4 text-left text-sm lg:text-lg font-semibold">
                        {product.name.length > 35
                          ? product.name.substring(0, 35) + "..."
                          : product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.productCategories?.nodes?.[0]?.name || ""}</p>
                    </div>
                  </div>

                  <div className="mt-2 px-3 w-full">
                    {(() => {
                      const colors =
                        product.attributes?.nodes
                          ?.filter((attr) => attr.name === "pa_color")
                          ?.flatMap((attr) => attr.options) || [];

                      const limitedColors = colors.slice(0, 3);
                      const remaining = colors.length - 3;

                      return (
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex justify-center gap-2">
                            {limitedColors.map((color, index) => (
                              <span
                                key={index}
                                className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
                                style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                title={color}
                              />
                            ))}

                            {remaining > 0 && (
                              <span className="inline-flex -ml-1 items-center font-geograph-md underline justify-center w-5 h-5 text-sm text-black">
                                +{remaining}
                              </span>
                            )}
                          </div>

                          {product.__typename === "SimpleProduct" && (
                            <div className="text-center">
                              {product.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg font-bold price-font text-red-600">
                                    D {product.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {product.regularPrice}
                                  </p>
                                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                    {getDiscountPercent(product.regularPrice, product.salePrice)}% OFF
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {product.regularPrice}</p>
                              )}
                            </div>
                          )}
                          {product.__typename === "VariableProduct" && firstVariation && (
                            <div className="text-center flex items-center gap-1">
                              {firstVariation.salePrice ? (
                                <>
                                  <p className="text-md lg:text-lg price-font text-black">
                                    D {firstVariation.salePrice}
                                  </p>
                                  <p className="text-sm line-through price-font text-gray-500">
                                    D {firstVariation.regularPrice}
                                  </p>
                                  <span className="text-sm text-red-500">
                                    ({getDiscountPercent(firstVariation.regularPrice, firstVariation.salePrice)}% OFF)
                                  </span>
                                </>
                              ) : (
                                <p className="text-md lg:text-lg price-font">D {firstVariation.regularPrice}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              Prev
            </button>

            <p className="text-sm">
              Page {currentPage} of {totalPages}
            </p>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;