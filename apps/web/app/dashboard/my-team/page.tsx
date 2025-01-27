"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerCard from "../../components/PlayerCard";
import DataSnippetHeader from "../../components/DataSnippet";
import FieldDisplay from "../../components/FieldDisplay";

export interface Player {
  id: string;
  name: string;
  position: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
  price: number;
  available_for_transfer: boolean;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  team: {
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  team: {
    id: string;
    name: string;
    budget: number;
  };
}

export default function MyTeamPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [userResponse, teamResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/team`, {
          credentials: "include",
        }),
      ]);

      if (!userResponse.ok || !teamResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const userData = await userResponse.json();
      const teamData = await teamResponse.json();

      setUserData(userData.user);
      setPlayers(teamData);
    } catch (err) {
      setError("Something went wrong while fetching your data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <DataSnippetHeader
        budget={userData?.team.budget}
        team_name={userData?.team.name}
      />
      <div className="px-12 gap-4 flex flex-col py-6">
        <h2 className="text-2xl font-semibold">My Team</h2>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            name={player.name}
            position={player.position}
            price={player.price}
            available_for_transfer={player.available_for_transfer}
            id={player.id}
            team={player.team}
          />
        ))}
      </div>
      <FieldDisplay players={players} />
    </div>
  );
}
