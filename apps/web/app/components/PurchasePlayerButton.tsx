import {Button} from "@repo/ui/components/button";
import {toast} from "sonner";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/ui/components/popover";

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
      toast.error("Insufficient budget to purchase this player.");
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

      toast.success("Player purchased successfully!");
      onPurchaseComplete();
    } catch (error) {
      console.error("Error purchasing player:", error);
      toast.error("Error purchasing player. Please try again.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Purchase</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{name}</h4>
            <p className="text-sm text-muted-foreground">All you need to know about the player</p>
          </div>
          <div className="grid gap-2 bg-white rounded-lg mb-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Position:</span>
              <span>{position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Team:</span>
              <span>{team.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Original Price:</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discounted Price:</span>
              <span className="text-red-500">${discountedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Budget:</span>
              <span>${budget?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount:</span>
              <span>10%</span>
            </div>
            <Button className="mt-4" onClick={handlePurchase}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
