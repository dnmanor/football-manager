"use client";

import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        priceRange,
        setPriceRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
