"use client";
import { useRouter } from "next/router";

export default function PaymentFailed() {
  const router = useRouter();
  const { order } = router.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, your payment was not completed.
        </p>

        {order && (
          <p className="text-gray-600 mb-4">
            Order Reference: <strong>{order}</strong>
          </p>
        )}

        <button
          onClick={() => router.push("/checkout")}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}