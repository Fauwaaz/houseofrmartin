import Link from "next/link";
import { Layout } from "../components";

export default function Custom500() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-screen text-center text-black">
                <h1 className="text-6xl mb-4">500</h1>
                <p>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/" className="text-center text-black mb-10">
                    <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                        Go Back Home
                    </button>
                </Link>
            </div>
        </Layout>
    );
}