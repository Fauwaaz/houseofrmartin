import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy | House of R-Martin</title>
            </Head>
            <Cart />
            <Navbar />
            <div className="px-6 mt-[80px] py-6">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p>Introduction</p>
            <p>
                At the House of R-Martin, your privacy matters deeply to us. This policy outlines how we collect, use, and protect your personal information when you visit our website or make a purchase.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
            <ul className="list-disc list-inside">
                <li>Personal details such as your name, contact number, email, and delivery address.</li>
                <li>Payment and transaction details (processed securely through payment gateways).</li>
                <li>Data collected automatically, including IP address, browser type, and device information.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside">
                <li>Process orders and deliver products.</li>
                <li>Communicate updates or offers relevant to your interests.</li>
                <li>Improve user experience and website functionality.</li>
                <li>Comply with legal obligations and prevent fraudulent transactions.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Protection</h2>
            <p>Your personal data is stored securely and accessed only by authorized personnel. Payment details are encrypted and processed through secure gateways.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">4. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience. You can modify your browser settings to refuse cookies, though this may limit site functionality.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">5. Third-Party Links</h2>
            <p>We are not responsible for third-party websites linked from our site.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">6. Your Rights</h2>
            <p>You may request access, correction, or deletion of your personal data at any time by emailing us at <a href="mailto:support@houseofrmartin.com" className="text-blue-600">support@houseofrmartin.com</a>.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">7. Policy Updates</h2>
            <p>We may revise this Privacy Policy occasionally. Updates will be posted on this page with an updated “Last Revised” date.</p>
            </div>
            <Footer />
        </>
    );
}