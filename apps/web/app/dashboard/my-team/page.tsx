"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataSnippetHeader from "../../components/DataSnippet";

type Team = {
  id: string;
  name: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  team: Team;
};

type UserResponse = {
  user: User;
};

export default function MyTeamPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch team data");
        }

        const data = (await response.json()) as UserResponse;
        console.log(data);
        if (data.user) {
          setUserData(data.user);
        } else {
          throw new Error("No team data available");
        }
      } catch (err) {
        setError("Something went wrong while fetching your team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>

        <DataSnippetHeader team_name={userData?.team.name} budget={userData?.team.budget} />

    </div>
  );
}
