"use client";
import React from "react";

type DataSnippetProps = {
  team_name?: string;
  budget?: number;
};

const DataSnippetHeader = ({ team_name, budget }: DataSnippetProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center items-start sm:justify-between px-12">
      <div className="text-2xl">{team_name ?? "User FC"}</div>
      <div className="font-bold text-gray-500">${budget ?? 0}</div>
    </div>
  );
};

export default DataSnippetHeader;
