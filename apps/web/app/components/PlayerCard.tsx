import React, { useState } from 'react';

interface PlayerCardProps {
  name: string;
  position: string;
  price: number;
  isAvailable: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, position, price, isAvailable }) => {
  const [available, setAvailable] = useState(isAvailable);

  const toggleAvailability = () => {
    setAvailable(!available);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <div className="flex items-center">
        <img
          src="/avatar-placeholder.png"
          alt="Player Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-400">{position}</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400">Price</p>
        <p className="text-lg font-semibold">${price}</p>
      </div>
      <div>
        <label className="flex items-center">
          <span className="mr-2">{available ? 'Available' : 'Unavailable'}</span>
          <input
            type="checkbox"
            checked={available}
            onChange={toggleAvailability}
            className="toggle-checkbox"
          />
        </label>
      </div>
    </div>
  );
};

export default PlayerCard;