import { Player } from "../dashboard/my-team/page";

const FieldDisplay = ({ players }: { players: Player[] }) => {
    const renderPlayer = (player: Player) => (
      <div
        key={player.id}
        className="bg-red-600 text-white p-2 text-sm rounded-full text-center w-16 h-16 flex items-center justify-center"
      >
        {player.name.split(" ")[0]}
      </div>
    );
  
    return (
      <div className="mb-3 mt-6 px-12">
        <div className="h-screen bg-green-700 p-4 grid grid-rows-4 gap-4">
          <div className="flex justify-center">
            {players
              .filter((p) => p.position === "GOALKEEPER")
              .slice(0, 1)
              .map(renderPlayer)}
          </div>
          <div className="flex justify-around">
            {players
              .filter((p) => p.position === "DEFENDER")
              .slice(0, 4)
              .map(renderPlayer)}
          </div>
          <div className="flex justify-around">
            {players
              .filter((p) => p.position === "MIDFIELDER")
              .slice(0, 4)
              .map(renderPlayer)}
          </div>
          <div className="flex justify-around">
            {players
              .filter((p) => p.position === "FORWARD")
              .slice(0, 2)
              .map(renderPlayer)}
          </div>
        </div>
      </div>
    );
  };
  
  export default FieldDisplay