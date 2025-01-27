import type {Metadata} from "next";
import "@repo/ui/globals.css";
import {Toaster} from "sonner";

export const metadata: Metadata = {
  title: "Football Manager Online",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
