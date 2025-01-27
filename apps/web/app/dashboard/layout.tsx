import React from "react";
import TopNavigation from "../components/TopNavigation";
import { FilterProvider } from "../context/FilterContext";

const DashboarLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex flex-col">
      <TopNavigation />
      {children}
    </main>
  );
};

export default DashboarLayout;
