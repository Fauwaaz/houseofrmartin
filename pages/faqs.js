import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Layout } from "../components";

const faqs = [
    {
        q: "What is House of R-Martin all about?",
        a: `A brand that stands at the intersection of clarity and character, shaping a world where men dress with intent and confidence speaks softly.
    In a market crowded with momentary trends, House of R-Martin chooses direction over noise. Each drop strikes balance between relevance and restraint — printed shirts that make statements, coords that move with you, and essentials that belong everywhere from boardroom to streetlight.`,
    },
    {
        q: "What kind of products do you offer?",
        a: `We specialize in premium everyday menswear essentials — T-shirts, polos, trousers, and wardrobe basics that are stylish, versatile, and built to last.
    Every piece is crafted to deliver comfort, confidence, and timeless appeal, no matter the occasion.`,
    },
    {
        q: "How can I place an order?",
        a: `You can shop through our official website.
    Simply browse the collection, add your favorite pieces to your cart, and checkout using our secure payment options.
    It's quick, safe, and effortless.`,
    },
    {
        q: "Do you ship internationally?",
        a: `Currently, we ship across the United Arab Emirates, ensuring reliable and timely delivery.
    International shipping is coming soon — stay tuned by subscribing to our newsletter or following us on social media for updates!`,
    },
    {
        q: "How long will my order take to arrive?",
        a: `Orders are typically delivered in 2-3 business days, depending on your location.
    Once your order is shipped, you'll receive a tracking link to follow your delivery in real time.`,
    },
    {
        q: "What is your return policy?",
        a: (
            <>
                We offer a 7-day easy return and exchange policy.
                If something doesn&apos;t fit right, we&apos;ll make it right — no questions asked.{" "}
                <Link
                    href="/shipping-return-refund"
                    className="text-red-500 underline hover:text-red-600 transition-colors"
                >
                    Learn more about our Return & Refund Policy.
                </Link>
            </>
        ),
    },
    {
        q: "How do I initiate a return or exchange?",
        a: (
            <>
                Refer to our{" "}
                <Link
                    href="/return-refund-policy"
                    className="text-red-500 underline hover:text-red-600 transition-colors"
                >
                    Return & Refund Policy
                </Link>{" "}
                or contact us directly at{" "}
                <a
                    href="mailto:orders@houseofrmartin.com"
                    className="text-red-500 underline hover:text-red-600 transition-colors"
                >
                    orders@houseofrmartin.com
                </a>
                . Our team will get back to you within 24-48 hours (except weekends and public holidays).
            </>
        ),
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Layout>
            <section className="mt-[80px] text-black py-20 px-6 md:px-12 font-geograph-md">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-center text-4xl md:text-6xl mb-10 tracking-tight">
                        Frequently Asked Questions
                    </h1>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-700 pb-4 cursor-pointer"
                            >
                                <div
                                    onClick={() => toggleFAQ(index)}
                                    className="flex justify-between items-center"
                                >
                                    <h3 className="text-lg md:text-xl text-black-800 transition-colors">
                                        {faq.q}
                                    </h3>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-black-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-black-400" />
                                    )}
                                </div>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden mt-3 text-black/70 leading-relaxed text-base"
                                        >
                                            <p className="whitespace-pre-line">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                    <Link href="/" className="text-center text-black mb-10">
                        <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                            Go Back Home
                        </button>
                    </Link>
                    <Link href="/products   " className="text-center text-black mb-10">
                        <button className="ml-2 mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                            Return to Shop
                        </button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
}