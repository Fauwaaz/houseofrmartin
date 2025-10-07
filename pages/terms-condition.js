import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

export default function TermsAndConditions() {
    return (
        <>
            <Head>
                <title>Terms & Conditions | House of R-Martin</title>
            </Head>
            <Cart />
            <Navbar />
            <div className="px-6 mt-[80px] py-6 text-left">
                <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
                <p>Welcome to House of R-Martin, a brand rooted in timeless elegance and refined craftsmanship. These Terms & Conditions govern your use of our website and purchase of products in the UAE.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">1. General</h2>
                <ul className="list-disc list-inside">
                    <li>All products and services are subject to availability.</li>
                    <li>Prices are in AED (VAT included unless stated otherwise).</li>
                    <li>We reserve the right to modify or discontinue products, services, or prices without notice.</li>
                    <li>All content, imagery, and design elements are property of House of R-Martin.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">2. Orders</h2>
                <ul className="list-disc list-inside">
                    <li>Confirmation emails are sent after orders are placed.</li>
                    <li>We may decline or cancel orders for payment failure, unavailability, or suspected fraud.</li>
                    <li>Orders are processed only after full payment is received.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">3. Product Information</h2>
                <p>We ensure accurate descriptions, images, and details. Slight variations may occur due to photography, lighting, or screens.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">4. Payment</h2>
                <p>Payments are accepted through major debit/credit cards and secure gateways. Transactions are in AED.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
                <p>House of R-Martin is not liable for indirect, incidental, or consequential damages arising from the use of our website or products.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">6. Governing Law</h2>
                <p>These Terms are governed by UAE law. Disputes fall under Dubai courts jurisdiction.</p>
            </div>
            <Footer />
        </>
    );
}