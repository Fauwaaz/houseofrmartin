import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/ProductInfo.module.css";
import { FiShoppingBag } from "react-icons/fi";
import Image from "next/image";

const ProductInfo = ({ product, isMounted }) => {
  const { onAdd, qty, setShowCart } = useStateContext();

  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  const sizes =
    product.attributes?.nodes
      ?.filter((attr) => attr.name === "pa_size")
      ?.flatMap((attr) => attr.options) || [];

  useEffect(() => {
    if (product) {
      // Get all variants
      const variants = product.variations?.nodes || [];
      setAllVariants(variants);
      
      // Extract all color attributes from the product
      const colorAttribute = product.attributes?.nodes?.find(
        attr => attr.name.toLowerCase() === "pa_color"
      );
      
      const colors = [];
      
      if (colorAttribute && colorAttribute.options) {
        // For each color option, find the best variant to represent it
        colorAttribute.options.forEach(colorName => {
          // Try to find a variant with this color that has an image
          let bestVariant = null;
          
          // First priority: variant with this color that has its own image
          for (const variant of variants) {
            const variantColor = getColorName(variant);
            if (variantColor.toLowerCase() === colorName.toLowerCase()) {
              if (variant?.image?.sourceUrl) {
                bestVariant = variant;
                break;
              } else if (!bestVariant) {
                bestVariant = variant; // Fallback to any variant with this color
              }
            }
          }
          
          // If no variant found, try to find an image in gallery
          if (!bestVariant) {
            bestVariant = { 
              attributes: { 
                nodes: [{ 
                  name: "pa_color", 
                  value: colorName 
                }] 
              } 
            };
          }
          
          colors.push({
            name: colorName,
            variant: bestVariant
          });
        });
      } else {
        // Fallback: extract colors from variants
        const colorMap = new Map();
        variants.forEach(variant => {
          const colorAttr = variant.attributes?.nodes?.find(
            attr => attr.name.toLowerCase() === "pa_color"
          );
          
          if (colorAttr && !colorMap.has(colorAttr.value.toLowerCase())) {
            colorMap.set(colorAttr.value.toLowerCase(), {
              name: colorAttr.value,
              variant: variant
            });
          }
        });
        
        colors.push(...Array.from(colorMap.values()));
      }
      
      setAvailableColors(colors);
    }
  }, [product]);

  // Get all variants for the selected size
  const getVariantsForSize = (size) => {
    return allVariants.filter(variant => {
      const sizeAttr = variant.attributes?.nodes?.find(
        attr => attr.name.toLowerCase() === "pa_size"
      );
      return sizeAttr && sizeAttr.value.toLowerCase() === size.toLowerCase();
    });
  };

  const getVariationImage = (variation, colorName) => {
    // First, try to get the variant's own image
    if (variation?.image?.sourceUrl) {
      return variation.image.sourceUrl;
    }
    
    // Then try gallery images from the variant
    if (variation?.galleryImages?.nodes?.length > 0) {
      return variation.galleryImages.nodes[0].sourceUrl;
    }
    
    // Try to find an image in the main product gallery that matches the color
    if (colorName && product?.galleryImages?.nodes) {
      const colorValue = colorName.toLowerCase();
      const matchingImage = product.galleryImages.nodes.find(
        (img) => img.altText?.toLowerCase().includes(colorValue) ||
                 img.title?.toLowerCase().includes(colorValue) ||
                 img.sourceUrl?.toLowerCase().includes(colorValue)
      );
      if (matchingImage) return matchingImage.sourceUrl;
    }
    
    // Fallback to product featured image
    if (product?.featuredImage?.node?.sourceUrl) {
      return product.featuredImage.node.sourceUrl;
    }
    
    return "/placeholder.jpg";
  };

  const getColorName = (variation) => {
    return variation?.attributes?.nodes?.find(
      (attr) => attr.name.toLowerCase() === "pa_color"
    )?.value || "Unknown";
  };

  const getSize = (variation) => {
    return variation?.attributes?.nodes?.find(
      (attr) => attr.name.toLowerCase() === "pa_size"
    )?.value || "Unknown";
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    
    // Try to maintain the same color when changing size
    if (selectedVariation) {
      const currentColor = getColorName(selectedVariation);
      const variantsForNewSize = getVariantsForSize(size);
      const matchingVariant = variantsForNewSize.find(variant => 
        getColorName(variant).toLowerCase() === currentColor.toLowerCase()
      );
      
      if (matchingVariant) {
        setSelectedVariation(matchingVariant);
      } else if (variantsForNewSize.length > 0) {
        // Fallback to first available variant for the new size
        setSelectedVariation(variantsForNewSize[0]);
      } else {
        setSelectedVariation(null);
      }
    } else {
      // If no variant selected, select the first one for the new size
      const variantsForNewSize = getVariantsForSize(size);
      if (variantsForNewSize.length > 0) {
        setSelectedVariation(variantsForNewSize[0]);
      }
    }
  };

  useEffect(() => {
    // Set initial selected variation based on default selected size
    if (allVariants.length > 0 && !selectedVariation) {
      const variantsForSize = getVariantsForSize(selectedSize);
      if (variantsForSize.length > 0) {
        setSelectedVariation(variantsForSize[0]);
      }
    }
  }, [allVariants, selectedSize]);

  const handleColorSelect = (colorName) => {
    const variantsForSize = getVariantsForSize(selectedSize);
    const matchingVariant = variantsForSize.find(variant => 
      getColorName(variant).toLowerCase() === colorName.toLowerCase()
    );
    
    if (matchingVariant) {
      setSelectedVariation(matchingVariant);
    }
  };

  // Check if a color is available for the selected size
  const isColorAvailableForSize = (colorName) => {
    return getVariantsForSize(selectedSize).some(variant => 
      getColorName(variant).toLowerCase() === colorName.toLowerCase()
    );
  };

  return (
    <div>
      <h1 className="text-3xl mb-2 font-geograph">
        {product?.name || (
          <span className="inline-block animate-pulse bg-gray-200 h-8 w-2/3 rounded" />
        )}
      </h1>

      {"price" in product ? (
        <span className={styles.price}>
          <p className="price-font">D</p> {product.price}
        </span>
      ) : (
        <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
      )}

      <hr className="border-black/10 border-solid my-3" />

      <p className="mt-2">Select size</p>
      {sizes.length > 0 ? (
        <div className="flex mt-2 gap-1 flex-wrap">
          {sizes.map((size, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded uppercase cursor-pointer ${selectedSize === size
                ? "bg-black text-white border-black"
                : "border-gray-400 bg-white"
                }`}
              onClick={() => handleSizeSelect(size)}
            >
              {size}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex mt-4 gap-2 animate-pulse">
          <div className="h-9 w-14 rounded border bg-gray-100" />
          <div className="h-9 w-14 rounded border bg-gray-100" />
        </div>
      )}

      <div className="mt-6">
        <button
          className={`${styles.button} ${styles.dark_button} uppercase flex items-center gap-2 justify-center ${!selectedSize || !selectedVariation
            ? "opacity-50 cursor-not-allowed"
            : ""
            }`}
          disabled={!selectedSize || !selectedVariation}
          onClick={() => onAdd(selectedVariation, qty)}
        >
          Add to Bag <FiShoppingBag size={18} />
        </button>
      </div>

      {availableColors.length > 0 && (
        <>
          <p className="mt-3">Available colors: ({availableColors.length})</p>
          <div className="flex mt-2 gap-2 flex-wrap">
            {availableColors.map((color, index) => {
              const isAvailable = isColorAvailableForSize(color.name);
              const isSelected = selectedVariation && 
                                getColorName(selectedVariation).toLowerCase() === color.name.toLowerCase();
              
              // Use the variant image for this color
              const imageUrl = getVariationImage(color.variant, color.name);

              return (
                <div key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => isAvailable && handleColorSelect(color.name)}
                    className={`relative w-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isSelected
                      ? "border-black shadow-md"
                      : isAvailable 
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-300 opacity-40 cursor-not-allowed"
                      }`}
                    title={isAvailable 
                      ? `${color.name} - Size ${selectedSize}` 
                      : `${color.name} not available in size ${selectedSize}`
                    }
                    disabled={!isAvailable}
                  >
                    <div className="relative w-full h-20">
                      <Image
                        src={imageUrl}
                        alt={`${product?.name} - ${color.name}`}
                        className="object-contain"
                        fill
                        sizes="80px"
                        priority={index < 4}
                        onError={(e) => {
                          console.log(`Failed to load image for ${color.name}: ${imageUrl}`);
                          e.target.src = product?.featuredImage?.node?.sourceUrl || "/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Border overlay for selected */}
                    {isSelected && (
                      <span className="absolute inset-0 border-2 border-black rounded-lg pointer-events-none"></span>
                    )}
                    
                    {/* Overlay for unavailable colors */}
                    {!isAvailable && (
                      <span className="absolute inset-0 bg-gray-100 opacity-50 rounded-lg pointer-events-none"></span>
                    )}
                  </button>

                  {/* Color text below thumbnail */}
                  <p className={`text-xs text-center capitalize mt-1 font-medium ${
                    isSelected ? 'font-bold' : isAvailable ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {color.name}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Selected variant info */}
          {selectedVariation && (
            <p className="mt-2 text-sm capitalize bg-white p-2 rounded-lg w-1/3">
              Selected: {getColorName(selectedVariation)} - Size {getSize(selectedVariation)}
            </p>
          )}
        </>
      )}

      {/* DESCRIPTION */}
      <p className="mt-5 font-geograph-md uppercase">Description</p>
      {isMounted ? (
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <div className="mt-4 space-y-2 animate-pulse">
          <div className="bg-gray-200 h-4 rounded w-full" />
          <div className="bg-gray-200 h-4 rounded w-11/12" />
          <div className="bg-gray-200 h-4 rounded w-10/12" />
        </div>
      )}
    </div>
  );
};

export default ProductInfo;