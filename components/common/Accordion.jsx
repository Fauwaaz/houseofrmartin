import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, MinusIcon, PlusIcon } from "lucide-react";

const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left text-md font-medium uppercase cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut", 
              opacity: { duration: 0.3 },
              height: { type: "spring", stiffness: 200, damping: 30 } 
            }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-4 text-gray-700 text-sm">
              {typeof content === "string" ? <p>{content}</p> : content}
            </div>
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