"use client";

import React, {useEffect, useState} from "react";
import {Player} from "../my-team/page";
import PlayerCard from "../../components/PlayerCard";
import {useFilter} from "../../context/FilterContext";
import {Input} from "@repo/ui/components/input";
import {FilterProvider} from "../../context/FilterContext";

interface User {
  id: string;
  email: string;
  name: string;
  team: {
    id: string;
    name: string;
    budget: number;
  };
}

const MarketPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const {searchTerm, setSearchTerm} = useFilter();
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [playersResponse, userResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/player/available`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          credentials: "include",
        }),
      ]);

      const playersData = await playersResponse.json();
      const userData = await userResponse.json();

      setPlayers(playersData);
      setUser(userData.user);
      console.log(userData.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const prepareTeamsList = () => {
    const teams = players.map((player) => player.team.name);
    return ["all", ...new Set(teams)];
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearchTerm =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeam = selectedTeam === "all" || player.team.name === selectedTeam;

    return matchesSearchTerm && matchesTeam;
  });

  if (!user || !user.team) {
    return <div>Loading...</div>;
  }

  const handleRemovePlayer = (playerId: string) => {
    console.log("playerId =>", playerId);
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
  };

  return (
    <div className="px-4 md:px-12 gap-4 flex flex-col py-6">
      <h2 className="text-xl md:text-2xl font-semibold">Market</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by player name or team name"
          className="px-4 py-2 border rounded-md w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="mb-4">
          <h3 className="font-semibold">Teams</h3>
          <div className="flex flex-wrap gap-4">
            {prepareTeamsList().map((team) => (
              <div key={team} className="flex items-center capitalize text-sm">
                <input
                  type="checkbox"
                  checked={selectedTeam === team}
                  onChange={() => setSelectedTeam(team)}
                  className="mr-2"
                />
                <label className="truncate">{team}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {user?.team?.budget &&
            filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                {...player}
                isOnMarket
                budget={user.team.budget}
                onPurchaseComplete={fetchData}
                isOwnPlayer={player.teamId === user.team.id}
                onRemovePlayer={handleRemovePlayer}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const MarketWithProvider = () => {
  return (
    <FilterProvider>
      <MarketPage />
    </FilterProvider>
  );
};

export default MarketWithProvider;
