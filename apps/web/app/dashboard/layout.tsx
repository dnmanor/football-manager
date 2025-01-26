import React from "react";

const DashboarLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main>{children}</main>;
};

export default DashboarLayout;
