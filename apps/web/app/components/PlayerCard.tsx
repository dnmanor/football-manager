import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import React, { useState } from "react";
import { Player } from "../dashboard/my-team/page";

type PlayerCardProps = Pick<
  Player,
  "name" | "position" | "price" | "available_for_transfer" | "id"
>;

const preparePositionText = (position: Player["position"]): string => {
  const positionMap: Record<string, string> = {
    GOALKEEPER: "GK",
    DEFENDER: "DF",
    MIDFIELDER: "MF",
    FORWARD: "FW",
  };

  return positionMap[position] || position;
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  position,
  price,
  available_for_transfer,
  id,
}) => {
  const [available, setAvailable] = useState(available_for_transfer);

  const updatePlayerAvailability = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ available_for_transfer: !available }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update player availability");
      }
    } catch (error) {
      console.error("Error updating player availability:", error);
    }
  };

  const toggleAvailability = () => {
    setAvailable(!available);
    updatePlayerAvailability();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center gap-x-3 mb-4 sm:mb-0">
        <div className="w-10 h-10 rounded-full bg-gray-400 px-2 flex items-center justify-center">
          <span className="text-white text-base sm:text-lg font-bold">
            {preparePositionText(position)}
          </span>
        </div>
        <div className="w-full sm:w-32">
          <h3 className="text-base sm:text-lg font-semibold sm:truncate">{name}</h3>
        </div>
      </div>
      <div className="text-center mb-4 sm:mb-0">
        <p className="text-base sm:text-lg font-semibold">${price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          onCheckedChange={toggleAvailability}
          checked={available}
        />
        <Label htmlFor="available" className="text-sm sm:text-base">Available</Label>
      </div>
    </div>
  );
};

export default PlayerCard;
