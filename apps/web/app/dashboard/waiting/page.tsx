"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const WaitingPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTeamStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.user.team) {
          router.push("/dashboard/my-team");
        }
      } catch (err) {
        setError("Something went wrong while setting up your team");
      }
    };

    checkTeamStatus();

    const interval = setInterval(checkTeamStatus, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="mb-8">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Setting up your team
        </h1>

        <p className="text-gray-600">
          Please wait while we prepare your squad. This should only take a few
          moments...
        </p>

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default WaitingPage;
