export const initDataLayer = () => {
  if (typeof window !== "undefined" && !window.dataLayer) {
    window.dataLayer = [];
  }
};

export const pushEvent = (eventName, eventParams = {}) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  } else {
    console.warn("Data Layer not initialized:", eventName, eventParams);
  }
};