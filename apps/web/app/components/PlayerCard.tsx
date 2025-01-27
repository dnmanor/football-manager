import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Button } from "@repo/ui/components/button";
import React, { useState } from "react";
import { Player } from "../dashboard/my-team/page";
import { PurchasePlayerButton } from "./PurchasePlayerButton";

type PlayerCardProps = Pick<
  Player,
  "name" | "position" | "price" | "available_for_transfer" | "id" | "team"
> & {
  market?: boolean;
  budget?: number;
  onPurchaseComplete?: () => void;
};

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
  team,
  market = false,
  budget,
  onPurchaseComplete,
}) => {
  const [available, setAvailable] = useState(available_for_transfer);
  const [editablePrice, setEditablePrice] = useState(price);
  const discountedPrice = price * 0.9;

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

  const updatePlayerPrice = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: editablePrice }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update player price");
      }
    } catch (error) {
      console.error("Error updating player price:", error);
    }
  };

  const toggleAvailability = () => {
    setAvailable(!available);
    updatePlayerAvailability();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditablePrice(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex-col sm:flex-row text-center sm:text-left items-center gap-x-3 mb-4 sm:mb-0">
        <div className="w-10 h-10 rounded-full bg-gray-400 px-2 flex items-center justify-center">
          <span className="text-white text-base sm:text-lg font-bold">
            {preparePositionText(position)}
          </span>
        </div>
        <div className="w-full sm:w-32">
          <h3 className="text-base sm:text-lg font-semibold sm:truncate">
            {name}
          </h3>
          {market && (
            <p className="text-sm text-gray-500 sm:truncate">{team.name}</p>
          )}
        </div>
      </div>
      <div className="text-center mb-4 sm:mb-0">
        {market ? (
          <div>
            <p className="text-sm line-through text-gray-500">
              ${price.toFixed(2)}
            </p>
            <p className="text-base sm:text-lg font-semibold0">
              ${discountedPrice.toFixed(2)}
            </p>
          </div>
        ) : (
          <input
            type="number"
            value={editablePrice}
            onChange={handlePriceChange}
            onBlur={updatePlayerPrice}
            className="text-base sm:text-lg font-semibold border rounded-md p-1"
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        {market ? (
          <PurchasePlayerButton
            name={name}
            position={position}
            team={team}
            price={price}
            discountedPrice={discountedPrice}
            budget={budget || 0}
            id={id}
            onPurchaseComplete={onPurchaseComplete || (() => {})}
          />
        ) : (
          <>
            <Switch
              id="available"
              onCheckedChange={toggleAvailability}
              checked={available}
            />
            <Label htmlFor="available" className="text-sm sm:text-base">
              Available
            </Label>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
