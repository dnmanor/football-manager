"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Transfer {
  id: string;
  type: "BUY" | "SELL";
  amount: number;
  createdAt: string;
  player: {
    name: string;
    position: string;
  };
  team: {
    name: string;
  };
}

const TransfersPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTransferHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/transfer-history`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transfer history");
      }

      const data = await response.json();
      setTransfers(data);
    } catch (err) {
      setError("Something went wrong while fetching your transfer history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferHistory();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 gap-4 flex flex-col py-4 sm:py-6 md:py-0 mb-12">
      <h2 className="text-xl sm:text-2xl font-semibold">Transfer History</h2>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-lg mb-2">{transfer.player.name}</h3>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Position:</span> {transfer.player.position}</p>
              <p><span className="font-medium">Type:</span> {transfer.type}</p>
              <p><span className="font-medium">Amount:</span> ${transfer.amount.toFixed(2)}</p>
              <p><span className="font-medium">Date:</span> {new Date(transfer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransfersPage;
