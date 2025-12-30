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
            <div className="px-6 mt-[120px] lg:mt-[80px] py-6 text-left max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Refund, Return & Shipping Policy</h1>

                <h2 className="text-2xl mt-6 mb-2">1. Shipping</h2>
                <ul className="list-disc list-inside">
                    <li>Deliveries across UAE within 3-7 working days from order confirmation.</li>
                    <li>Free shipping on orders above AED 150.</li>
                    <li>A nominal shipping fee applies to orders below AED 150.</li>
                </ul>

                <h2 className="text-2xl mt-6 mb-2">2. Returns & Exchanges</h2>
                <ul className="list-disc list-inside">
                    <li>You have 7 days from delivery to decide if an item is right for you.</li>
                    <li>Items must be returned in their original condition, meaning: Unused, unworn, unwashed, Not damaged or altered, Returned with the original packaging</li>
                    <li>We do not accept returns that have been worn, washed, damaged, or altered in any way.</li>
                </ul>
                <h3 className="text-lg mt-2 mb-2">Non-Returnable / Non-Exchangeable Items</h3>
                <p className="mb-2">The following items cannot be returned or exchanged:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Accessories</li>
                    <li>Items bought during offers / promotions</li>
                </ul>

                <h3 className="text-lg mt-4 mb-2">Return & Exchange Process</h3>
                <p>To request a return or exchange:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Send an email to <a href="mailto:support@houseofrmartin.com" className="text-blue-600">support@houseofrmartin.com</a> with your order number and reason.</li>
                    <li>Our team will share return instructions. Once received, please pack the item(s) securely using the original packaging.</li>
                    <li>We will arrange a return booking and our shipping partner will collect the parcel from you.</li>
                </ul>

                <h2 className="text-2xl mt-6 mb-2">3. Exchanges</h2>
                <h3 className="text-lg mt-2 mb-2">Free Exchange (If We Made a Mistake)</h3>
                <p>If you received the wrong product, wrong size, or wrong color, we will exchange it free of charge, and the replacement will be delivered within 3 working days.</p>

                <h3 className="text-lg mt-4 mb-2">Exchange Charges (If You Want to Change Your Mind)</h3>
                <p>If you would like to exchange due to preference (for example: changing size, color, design, or exchanging for another item), an exchange delivery charge of AED 15 will apply.</p>

                <h2 className="text-2xl mt-6 mb-2">4. Refunds</h2>
                <h3 className="text-lg mt-4 mb-2">Refund Eligibility</h3>
                <p>Refunds are processed only for products returned in accordance with this policy and after they pass a quality inspection.</p>
                <h3 className="text-lg mt-4 mb-2">Refund Timeline</h3>
                <p>Refunds will be processed within 7 days after we receive your return package.</p>
                <h3 className="text-lg mt-4 mb-2">Shipping & Return Charges</h3>
                <ul className="list-disc list-inside">
                    <li>Original shipping charges are non-refundable.</li>
                    <li>A standard return shipping fee of AED 15 will be deducted from your refund amount.</li>
                </ul>

                <h3 className="text-lg mt-4 mb-2">Damaged / Incorrect Items</h3>
                <p>If your item is damaged or you received an incorrect item, House of R-Martin will cover the return shipping, and we will assist with a replacement or refund accordingly.</p>

                <h2 className="text-2xl mt-6 mb-2">5. Order Cancellation</h2>
                <ul className="list-disc list-inside">
                    <li>Orders may be cancelled within 12 hours of placing the order, as long as they have not been shipped.</li>
                    <li>Once the order is dispatched, our standard return and exchange policy applies.</li>
                </ul>
            </div>
            <FooterBar />
            <Footer />
        </>
    );
}