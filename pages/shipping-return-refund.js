import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import FooterBar from "../components/common/FooterBar";

export default function ShippingAndRefund() {
    return (
        <>
            <Head>
                <title>Shipping, Returns & Refunds | House of R-Martin</title>
            </Head>
            <Cart />
            <Navbar />
            <div className="px-6 mt-[120px] lg:mt-[80px] py-6 text-left">
                <h1 className="text-3xl font-bold mb-4">Refund, Return & Shipping Policy</h1>

                <h2 className="text-2xl font-semibold mt-6 mb-2">1. Shipping</h2>
                <ul className="list-disc list-inside">
                    <li>Deliveries across UAE within 3-7 working days from order confirmation.</li>
                    <li>Free shipping on orders above AED 100. Nominal fee applies below that.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">2. Returns & Exchanges</h2>
                <ul className="list-disc list-inside">
                    <li>Eligibility: Items must be unused, unworn, unwashed, in original packaging.</li>
                    <li>Timeframe: Return or exchange request within 7 days of receiving the order.</li>
                    <li>Non-Returnable Items: Accessories, custom-tailored products, and sale items.</li>
                </ul>
                <p>Process: Email <a href="mailto:support@houseofrmartin.com" className="text-blue-600">support@houseofrmartin.com</a> with your order number and reason. Our team will guide you.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">3. Refunds</h2>
                <ul className="list-disc list-inside">
                    <li>Refunds processed to the original payment method within 7-10 working days after quality inspection.</li>
                    <li>Shipping charges are non-refundable.</li>
                    <li>Damaged/incorrect items: brand covers return shipping.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">4. Order Cancellation</h2>
                <p>Orders can be cancelled within 12 hours if not shipped. Once dispatched, standard return/exchange policies apply.</p>
            </div>
            <FooterBar />
            <Footer />
        </>
    );
}