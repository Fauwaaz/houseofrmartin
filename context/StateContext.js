import React, { createContext, useContext, useEffect, useState } from "react";
import { getLocalCart, getLocalValues } from "../utils/utils";

const Context = createContext();

export const StateContext = ({ children }) => {
  // (typeof window !== "undefined" &&
  // JSON.parse(localStorage.getItem("cartItems"))) ||
  // []
  ///
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(getLocalCart("cartItems", []));

  const [totalPrice, setTotalPrice] = useState(getLocalValues("total", 0));
  const [totalQuantities, setTotalQuantities] = useState(
    getLocalValues("quantities", 0)
  );
  const [qty, setQty] = useState(getLocalValues("quantity", 1));

  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const productInCartExists = cartItems.find(
      (item) => item.id === product.id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );

    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (productInCartExists) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.id === product.id)
          return {
            ...cartItem,
            quantity: cartItem.quantity + quantity,
          };
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item.id === product.id);

    const newCartItems = cartItems.filter((item) => item.id !== product.id);
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );

    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );

    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, action) => {
    foundProduct = cartItems.find((item) => item.id === id);
    index = cartItems.findIndex((product) => product.id === id);
    const newCartItems = cartItems;

    if (action === "inc") {
      newCartItems.splice(index, 1, {
        ...foundProduct,
        quantity: foundProduct.quantity + 1,
      });
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);

      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (action === "dec") {
      if (foundProduct.quantity > 1) {
        newCartItems.splice(index, 1, {
          ...foundProduct,
          quantity: foundProduct.quantity - 1,
        });
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);

        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
    setCartItems(newCartItems);
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  useEffect(() => {
    localStorage.setItem("total", totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    localStorage.setItem("quantities", totalQuantities);
  }, [totalQuantities]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [
    cartItems,
    setCartItems,
    setTotalPrice,
    setTotalQuantities,
    totalPrice,
    totalQuantities,
    qty,
    incQty,
    decQty,
    onAdd,
    toggleCartItemQuantity,
    onRemove,
  ]);

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
