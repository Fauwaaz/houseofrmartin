"use client";

import { Banner, Layout } from "../../components";
import { useStateContext } from "../../context/StateContext";
import client from "../../libs/apollo";
import Image from "next/image";
import Link from "next/link";
import { GET_ALL } from "../../utils/queries";
import { colorMap } from "../../utils/data";

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_ALL,
  });

  const products = data?.products?.nodes || [];

  const category = data?.category;
  const posts = category?.posts?.nodes || [];
  const firstPost = posts.length > 0 ? posts[0] : null;

  const banner = firstPost?.banner || {
    title: "Default Banner Title",
    description: "Default Banner Description",
    uri: "#",
    image: {
      sourceUrl: "/placeholder.jpg",
    },
  };

  return {
    props: {
      products,
      banner,
    },
    revalidate: 1,
  };
}

const Products = ({products}) => {
    const { onAdd, qty } = useStateContext();

    return (
        <Layout>
            <div className="w-full h-[90px] mx-auto mt-10">

            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-5 mb-10">
                {products.map((product) => {
                    let displayPrice = null;
                    let firstVariation = null;

                    if (product.__typename === "VariableProduct" && product.variations?.nodes?.length > 0) {
                        const sorted = [...product.variations.nodes].sort(
                            (a, b) => parseFloat(a.price) - parseFloat(b.price)
                        );
                        firstVariation = sorted[0];
                        displayPrice = firstVariation.price;
                    }

                    return (
                        <div
                            key={product.id}
                            className="bg-white shadow-sm rounded-[20px] flex flex-col items-center overflow-hidden pb-4 relative"
                        >
                            <div className="bg-black/70 w-[110px] lg:w-[150px]  py-2 text-[12px] lg:text-sm text-white text-center absolute rounded-full z-10 uppercase top-3 left-3">
                                Best Seller
                            </div>


                            <Link href={`/products/${product.slug}`} className="w-full relative group">
                                <Image
                                    src={product.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                                    alt={product.name}
                                    width={600}
                                    height={300}
                                    className="object-cover transition-opacity duration-300 group-hover:opacity-0"
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
                            {/* <button
                    onClick={() => onAdd(product, qty)}
                    className="px-3 py-3 bg-black text-white w-full text-center hover:bg-gray-900 cursor-pointer"
                  >
                    Add to Bag
                  </button> */}

                            <div className="flex w-full items-center justify-between px-3">

                                <h3 className="mt-4 text-lg font-semibold">
                                    {product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}
                                </h3>
                                <p
                                    className="text-sm text-gray-500 mt-2"
                                    dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                                />
                                {product.__typename === "SimpleProduct" && (
                                    <p className="mt-3 font-bold text-lg price-font">D {product.price}</p>
                                )}
                                {product.__typename === "VariableProduct" && firstVariation && (
                                    <div className="mt-3 text-center">
                                        <p className="font-bold text-lg price-font">
                                            D <span className="font-geograph-md">{displayPrice}</span>
                                        </p>
                                        {/* <p className="text-sm text-gray-700">
                          Variant: {firstVariation.name}
                        </p> */}
                                    </div>
                                )}
                            </div>
                            <div className="flex mt-3 px-3 w-full gap-2">
                                {product.attributes?.nodes
                                    ?.filter((attr) => attr.name === "pa_color")
                                    ?.flatMap((attr) => attr.options)
                                    ?.map((color, index) => (
                                        <span
                                            key={index}
                                            className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
                                            style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                            title={color}
                                        />
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

export default Products;