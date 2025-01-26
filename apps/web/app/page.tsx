import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/components/button";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <div>
      <main>
        <Button variant="destructive">Open alert</Button>
      </main>
    </div>
  );
}
