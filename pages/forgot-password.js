// /pages/forgot-password.js
"use client";
import { useState } from "react";
import axios from "axios";
import { Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Image from "next/image";

export default function ForgotPassword() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email address");

        try {
            setLoading(true);
            const { data } = await axios.post("https://dashboard.houseofrmartin.com/wp-json/custom/v1/forgot-password", { email });

            if (data.success) {
                toast.success("Password reset link sent! Please check your email.");
                setEmail("");
            } else {
                toast.error(data.message || "Unable to send reset link.");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-0 lg:min-h-[80vh] p-0 lg:p-6">
                <div className="max-w-md w-full bg-white shadow-lg rounded-none lg:rounded-2xl p-8">
                    <Link href="/auth" className="text-black hover:underline flex gap-1 items-center"><HiOutlineChevronLeft size={20} /> Back</Link>
                    <div className="inline-flex items-center justify-center rounded-full mb-4 w-full mt-6">
                        <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/logo.webp" alt="Logo" width={250} height={40} className='object-contain' />
                    </div>
                    <h1 className="text-2xl text-center mb-4">
                        Forgot Password
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Enter your registered email address and we'll send you a password reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-full flex justify-center items-center gap-2 hover:bg-gray-800 transition"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Mail size={18} />}
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-8">
                By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
                <Link href="/terms-condition" className="text-black hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy-policy" className="text-black hover:underline">Privacy Policy</Link>
            </p>
        </>
    );
}