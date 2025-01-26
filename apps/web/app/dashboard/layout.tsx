import React from "react";
import TopNavigation from "../components/TopNavigation";

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
