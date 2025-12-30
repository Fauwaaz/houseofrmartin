"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

const Popup = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("blackfridayPopupShown");
    if (seen) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("blackfridayPopupShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => setVisible(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("b1g1");
    setCopied(true);
    toast.success("Coupon copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="blackfriday-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] px-4"
          onClick={closePopup}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl h-auto lg:h-1/2 overflow-hidden flex flex-col md:flex-row lg:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-black/70 hover:text-black hover:bg-gray-200 p-1 rounded-full transition z-10"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Left: Image */}
            <div className="relative w-full md:w-1/2 lg:w-1/2 h-80 md:h-auto lg:h-auto">
              {/* <Image
                src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/cord-set-scaled.jpg"
                alt="Men’s Day Offer"
                fill
                unoptimized
                className="object-cover object-top"
              /> */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                // poster="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/home-houseofrmartin.jpg"
              >
                <source
                  src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/11/black-friday-sale.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col justify-center items-center text-center p-4 lg:p-8 lg:w-1/2 space-y-3 lg:space-y-5">
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-sm text-gray-500 uppercase tracking-[5px] lg:tracking-[7px]">
                    Special Offer
                  </span>
                  <h2 className="text-xl lg:text-2xl">
                    BLACK FRIDAY
                  </h2>
                </div>
                <div className="mt-2">
                  <h3 className="text-xs lg:text-sm capitalize font-geograph">
                    Limited Time Only
                    <br/>
                    22nd - 28th November 2025
                  </h3>
                  <p className="text-gray-700 text-xs lg:text-sm mt-1 leading-relaxed">
                    <span className="text-red-600 text-2xl lg:text-3xl">( Buy 1 - Get 1 <span className="text-xl">FREE</span>)</span> <br /> on all products site wide. <br />
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="group bg-black text-white font-geograph-md tracking-wider text-lg py-2 px-6 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-gray-900 transition relative"
              >
                B1G1
                {copied ? (
                  <CheckCircle2 size={18} className="text-green-400 transition-all" />
                ) : (
                  <Copy size={18} className="text-white/80 group-hover:text-white transition-all" />
                )}
              </button>

              <p className="text-xs text-gray-500">
                Tap to copy — valid for a limited time only.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;