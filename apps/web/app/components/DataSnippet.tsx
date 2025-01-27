"use client";
import React from "react";

type DataSnippetProps = {
  team_name?: string;
  budget?: number;
};

const DataSnippetHeader = ({team_name, budget}: DataSnippetProps) => {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-12">
      <div className="text-xl md:text-2xl font-semibold">{team_name ?? "User FC"}</div>
      <div className="font-bold text-gray-500 text-base md:text-lg">
        ${budget?.toFixed(2) ?? "0.00"}
      </div>
    </div>
  );
};

export default DataSnippetHeader;
