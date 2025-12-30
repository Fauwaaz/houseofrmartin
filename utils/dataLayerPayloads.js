
export const createEventPayloads = {
  addToCart: (product) => ({
    ecommerce: {
      currency: product.currency || "AED",
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
        },
      ],
    },
  }),

  addToWishlist: (product) => ({
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    },
  }),

  beginCheckout: (cart) => ({
    ecommerce: {
      items: cart.map((p) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      value: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    },
  }),

  purchase: (order) => ({
    ecommerce: {
      transaction_id: order.id,
      value: parseFloat(order.total) || 0,
      currency: order.currency || "AED",
      items: order.line_items?.map((item) => ({
        item_id: item.product_id,
        item_name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: item.quantity,
      })) || [],
    },
  }),


  refund: (order) => ({
    ecommerce: {
      transaction_id: order.id,
      value: order.total,
      currency: order.currency || "AED",
    },
  }),

  removeFromCart: (product) => ({
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
        },
      ],
    },
  }),

  selectItem: (product) => ({
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    },
  }),

  selectPromotion: (promotion) => ({
    ecommerce: {
      promo_id: promotion.id,
      promo_name: promotion.name,
    },
  }),

  viewCart: (cart) => ({
    ecommerce: {
      items: cart.map((p) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      value: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    },
  }),

  viewItem: (product) => ({
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    },
  }),

  viewItemList: (products) => ({
    ecommerce: {
      items: products.map((p) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
      })),
    },
  }),
};
