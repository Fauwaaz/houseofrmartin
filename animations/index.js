export const CartAnimation = {
  initial: {
    x: 600,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 20,
    },
  },
  exit: {
    x: 600,
    transition: {
      duration: 0.3,
    },
  },
};

export const BackgroundAnimation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    duration: 0.2,
    type: "spring",
    damping: 20,
  },
  exit: {
    opacity: 0,
  },
};

export const FeaturedAnimation = {
  initial: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

/* Hero Animations */

export const ValueAnimation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
