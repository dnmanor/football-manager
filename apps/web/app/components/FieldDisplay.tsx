import {Player} from "../dashboard/my-team/page";

const FieldDisplay = ({players}: {players: Player[]}) => {
  const renderPlayer = (player: Player) => (
    <div
      key={player.id}
      className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-1 py-1.5 text-[10px] sm:text-xs sm:px-1.5 sm:py-2 rounded-full text-center w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 font-medium"
    >
      {player.name.split(" ")[0].substring(0, 8)}
    </div>
  );

  return (
    <div className="relative h-screen w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 74 55.5"
        className="absolute inset-0 bg-red-100 hidden md:block"
        preserveAspectRatio="xMidYMid meet"
      >
        <path fill="#00a000" d="M0 0H74V55.5H0z" />
        <g fill="none" stroke="#fff" strokeWidth={0.5} transform="translate(3 3)">
          <path d="M0 0h68v52.5H0z" />
          <circle r={9.15} cx={34} cy={52.5} />
          <circle r={0.75} cx={34} cy={52.5} fill="#fff" stroke="none" />
          <g id="a">
            <path d="M13.84 0v16.5h40.32V0" />
            <path d="M24.84 0v5.5h18.32V0" />
            <circle r={0.75} cx={34} cy={10.94} fill="#fff" stroke="none" />
            <path d="M26.733 16.5a9.15 9.15 0 0014.534 0" />
          </g>
          <path d="M0 2a2 2 0 002-2m64 0a2 2 0 002 2" />
        </g>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 74 111"
        className="absolute inset-0 bg-red-100 md:hidden block"
      >
        <path fill="#00a000" d="M0 0H74V111H0z" />
        <g fill="none" stroke="#fff" strokeWidth={0.5} transform="translate(3 3)">
          <path d="M0 0h68v105H0zM0 52.5h68" />
          <circle r={9.15} cx={34} cy={52.5} />
          <circle r={0.75} cx={34} cy={52.5} fill="#fff" stroke="none" />
          <g id="a">
            <path d="M13.84 0v16.5h40.32V0" />
            <path d="M24.84 0v5.5h18.32V0" />
            <circle r={0.75} cx={34} cy={10.94} fill="#fff" stroke="none" />
            <path d="M26.733 16.5a9.15 9.15 0 0014.534 0" />
          </g>
          <use xlinkHref="#a" transform="rotate(180 34 52.5)" />
          <path d="M0 2a2 2 0 002-2m64 0a2 2 0 002 2m0 101a2 2 0 00-2 2m-64 0a2 2 0 00-2-2" />
        </g>
      </svg>

      <div className="absolute inset-3 md:grid md:grid-rows-4 flex flex-col gap-16">
        <div className="flex justify-center items-center">
          {players
            .filter((p) => p.position === "GOALKEEPER")
            .slice(0, 1)
            .map(renderPlayer)}
        </div>
        <div className="flex justify-around items-center">
          {players
            .filter((p) => p.position === "DEFENDER")
            .slice(0, 4)
            .map(renderPlayer)}
        </div>
        <div className="flex justify-around items-center">
          {players
            .filter((p) => p.position === "MIDFIELDER")
            .slice(0, 4)
            .map(renderPlayer)}
        </div>
        <div className="flex justify-around items-center">
          {players
            .filter((p) => p.position === "FORWARD")
            .slice(0, 2)
            .map(renderPlayer)}
        </div>
      </div>
    </div>
  );
};

export default FieldDisplay;
