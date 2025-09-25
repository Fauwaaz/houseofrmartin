import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href='/' className="flex gap-1 hover:underline"><ChevronLeft /> Back to home</Link>
      <h1 className="text-2xl font-bold">❌ Payment Cancelled</h1>
      <p>Your payment was not completed.</p>
    </div>
  );
}