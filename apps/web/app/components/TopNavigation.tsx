"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopNavigation() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-12">
      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4 uppercase text-sm">
          <a
            href="/dashboard/my-team"
            className="text-gray-700 hover:text-black"
          >
            My Team
          </a>
          <a
            href="/dashboard/transfers"
            className="text-gray-700 hover:text-black"
          >
            Transfers
          </a>
          <a
            href="/dashboard/market"
            className="text-gray-700 hover:text-black"
          >
            Market
          </a>
        </nav>
      </div>
      <LogOut
        className="w-6 h-6 cursor-pointer text-red-600"
        onClick={handleLogout}
      />
    </div>
  );
}
