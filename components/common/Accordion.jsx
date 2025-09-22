import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-3 text-left text-lg font-medium uppercase cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden pb-4 text-gray-600"
          >
            {typeof content === "string" ? <p>{content}</p> : content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion = ({ items }) => {
  return (
    <div className="w-full">
      {items.map((item, idx) => (
        <AccordionItem key={idx} {...item} />
      ))}
    </div>
  );
};

export default Accordion;