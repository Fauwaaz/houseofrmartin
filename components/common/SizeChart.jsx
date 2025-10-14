"use client";

import { Dialog } from "@headlessui/react";
import { useState, Fragment } from "react";
import { X } from "lucide-react";

export default function SizeChart({ category }) {
  const [isOpen, setIsOpen] = useState(false);

  const charts = {
    't-shirts': {
      title: "📏 T-Shirt Size Chart",
      headers: ["Size", "Chest (Flat)", "Chest (Round)", "Length"],
      rows: [
        ["M", "52 cm / 20.5 in", "104 cm / 40.9 in", "69 cm / 27.2 in"],
        ["L", "54 cm / 21.3 in", "108 cm / 42.5 in", "71 cm / 28.0 in"],
        ["XL", "56 cm / 22.0 in", "112 cm / 44.1 in", "73 cm / 28.7 in"],
        ["XXL", "58 cm / 22.8 in", "116 cm / 45.7 in", "75 cm / 29.5 in"],
      ],
    },
    shirts: {
      title: "📏 Shirt Size Chart",
      headers: ["Size", "Chest (Round)", "Length", "Shoulder Width", "Sleeve Length"],
      rows: [
        ["M", "102-106 cm / 40-41.5 in", "74-76 cm / 29-30 in", "45-46 cm / 17.7-18.1 in", "62 cm / 24.4 in"],
        ["L", "108-112 cm / 42.5-44 in", "76-8 cm / 30-31 in", "47-48 cm / 18.5-18.9 in", "63 cm / 24.8 in"],
        ["XL", "114-118 cm / 45-46.5 in", "78-80 cm / 31-31.5 in", "49-50 cm / 19.3-19.7 in", "64 cm / 25.2 in"],
        ["XXL", "120-124 cm / 47-48.5 in", "80-82 cm / 31.5-32 in", "51-52 cm / 20.1-20.5 in", "65 cm / 25.6 in"],
      ],
    },
    jeans: {
      title: "📏 Jeans Size Chart (Men's - Waist 30-38)",
      headers: ["Waist Size", "Waist (cm / in)", "Hip (cm / in)", "Inseam Length (cm / in)"],
      rows: [
        ["30", "76 cm / 30 in", "94-96 cm / 37-38 in", "76-81 cm / 30-32 in"],
        ["32", "81 cm / 32 in", "99-101 cm / 39-40 in", "76-81 cm / 30-32 in"],
        ["34", "86 cm / 34 in", "104-106 cm / 41-42 in", "76-81 cm / 30-32 in"],
        ["36", "91 cm / 36 in", "109-111 cm / 43-44 in", "76-81 cm / 30-32 in"],
        ["38", "96 cm / 38 in", "114-116 cm / 45-46 in", "76-81 cm / 30-32 in"],
      ],
    },
    trousers: {
      title: "📏 Cotton Trouser Size Chart (Men's - Waist 30-38)",
      headers: ["Waist Size", "Waist (cm / in)", "Hip (cm / in)", "Outseam Length (cm / in)", "Inseam Length (cm / in)"],
      rows: [
        ["30", "76 cm / 30 in", "94-96 cm / 37-38 in", "102-104 cm / 40-41 in", "76-78 cm / 30-31 in"],
        ["32", "81 cm / 32 in", "99-101 cm / 39-40 in", "104-106 cm / 41-42 in", "78-80 cm / 31-31.5 in"],
        ["34", "86 cm / 34 in", "104-106 cm / 41-42 in", "106-108 cm / 42-42.5 in", "80-81 cm / 31.5-32 in"],
        ["36", "91 cm / 36 in", "109-111 cm / 43-44 in", "108-110 cm / 42.5-43 in", "81-82 cm / 32 in"],
        ["38", "96 cm / 38 in", "114-116 cm / 45-46 in", "110-112 cm / 43-44 in", "82-83 cm / 32-32.5 in"],
      ],
    },
    belt: {
        title: "📏 Belt Size Chart",
        headers: ["Length", "Strap Width"],
        rows: [
            ["46-Inch/115-cm", "[1.35 in / 3.5 cm]"],
            ["48-Inch/115-cm", "[1.35 in / 3.5 cm]"],
            ["50-Inch/125-cm", "[1.35 in / 3.5 cm]"],
        ],
    },
    nosize: {
        title: "No Size Chart Available",
        headers: ["N/A", "N/A"],
        rows: [
          ["N/A", "N/A"]            
        ],
    }
  };

  const selectedChart =
    charts[
      Object.keys(charts).find((key) =>
        category?.toLowerCase()?.includes(key)
      ) || "nosize"
    ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 text-sm underline hover:text-black"
      >
        Size chart
      </button>

      <Dialog
        as={Fragment}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white w-full h-full lg:w-1/2 lg:h-1/2 overflow-y-auto relative p-6 lg:p-10  rounded-none lg:rounded-lg">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Header */}
            <h2 className="text-xl lg:text-3xl mb-6 text-center">
              Men&apos;s Size Charts
            </h2>

            {/* Selected chart */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg lg:text-2xl mb-4 text-center">
                {selectedChart.title}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm lg:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {selectedChart.headers.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-2 border border-gray-300 text-left"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChart.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-4 py-2 border border-gray-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}