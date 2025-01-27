import { Button } from "@repo/ui/components/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

export function PurchasePlayerButton({
  name,
  position,
  team,
  price,
  discountedPrice,
  budget,
  id,
  onPurchaseComplete,
}: {
  name: string;
  position: string;
  team: {
    name: string;
  };
  price: number;
  discountedPrice: number;
  budget: number;
  id: string;
  onPurchaseComplete: () => void;
}) {

  const handlePurchase = async () => {
    if (budget < discountedPrice) {
      alert("Insufficient budget to purchase this player.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}/purchase`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to purchase player");
      }

      alert("Player purchased successfully!");
      onPurchaseComplete(); 
    } catch (error) {
      console.error("Error purchasing player:", error);
      alert("Error purchasing player. Please try again.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Purchase</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{name}</h4>
            <p className="text-sm text-muted-foreground">
              All you need to know about the player
            </p>
          </div>
          <div className="grid gap-2 p-4 bg-white rounded-lg shadow-md">
            <p>Position: {position}</p>
            <p>Team: {team.name}</p>
            <p>Original Price: ${price.toFixed(2)}</p>
            <p className="text-red-500">
              Discounted Price: ${discountedPrice.toFixed(2)}
            </p>
            <p>Budget: ${budget?.toFixed(2)}</p>
            <p>Discount: 10%</p>
            <Button onClick={handlePurchase}>Confirm</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
