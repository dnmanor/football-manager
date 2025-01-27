import {Label} from "@repo/ui/components/label";
import {Switch} from "@repo/ui/components/switch";
import {Button} from "@repo/ui/components/button";
import React, {useState} from "react";
import {Player} from "../dashboard/my-team/page";
import {PurchasePlayerButton} from "./PurchasePlayerButton";
import {toast} from "sonner";

type PlayerCardProps = Pick<
  Player,
  "name" | "position" | "price" | "available_for_transfer" | "id" | "team"
> & {
  isOnMarket?: boolean;
  budget?: number;
  isOwnPlayer?: boolean;
  onRemovePlayer?: (playerId: string) => void;
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
  isOnMarket = false,
  budget,
  onPurchaseComplete,
  isOwnPlayer = false,
  onRemovePlayer,
}) => {
  const [available, setAvailable] = useState(available_for_transfer);
  const [editablePrice, setEditablePrice] = useState(price);
  const discountedPrice = price * 0.95;

  const updatePlayerAvailability = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({available_for_transfer: !available}),
      });

      if (!response.ok) {
        toast.error("Failed to update player availability");
        throw new Error("Failed to update player availability");
      }

      toast.success("Player availability updated successfully");
    } catch (error) {
      toast.error("Failed to update player availability");
      console.error("Error updating player availability:", error);
    }
  };

  const updatePlayerPrice = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({price: editablePrice}),
      });

      if (!response.ok) {
        toast.error("Failed to update player price");
        throw new Error("Failed to update player price");
      }

      toast.success("Player price updated successfully");
    } catch (error) {
      toast.error("Failed to update player price");
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
    <div className="flex md:w-[250px] w-full flex-col items-center justify-center py-4 bg-white border border-gray-100 rounded-md transition-all duration-300 hover:shadow-md hover:border-transparent cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gray-400 px-2 flex items-center justify-center">
        <span className="text-white text-base sm:text-lg font-bold">
          {preparePositionText(position)}
        </span>
      </div>
      <div className="w-full text-center mt-2 text-gray-800">
        <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
        {isOnMarket && <p className="text-sm text-gray-500">{team.name}</p>}
      </div>

      <div className="text-center mt-2 mb-4 sm:mb-0">
        {isOnMarket ? (
          <div>
            <p className="text-sm line-through text-gray-500">${price.toFixed(2)}</p>
            <p className="text-base sm:text-lg font-semibold0">${discountedPrice.toFixed(2)}</p>
          </div>
        ) : (
          <input
            type="number"
            value={editablePrice}
            onChange={handlePriceChange}
            onBlur={updatePlayerPrice}
            className="text-base sm:text-lg font-semibold p-1 bg-gray-100 text-center rounded-md hover:bg-gray-100 transition-colors"
          />
        )}
      </div>

      <div className="flex mt-4 items-center space-x-2">
        {isOnMarket ? (
          <>
            {isOwnPlayer ? (
              <Button
                onClick={() => {
                  updatePlayerAvailability();
                  onRemovePlayer?.(id);
                }}
              >
                Remove
              </Button>
            ) : (
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
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Switch
              id="available"
              onCheckedChange={toggleAvailability}
              checked={available}
              className="data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="available"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Available
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
