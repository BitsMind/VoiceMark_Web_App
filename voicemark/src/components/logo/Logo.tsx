import Link from "next/link";
import Image from "next/image";

export function Logo({ width = 200, height = 200 }) {
  return (
    <Link href="/home" className="flex items-center gap-2 pl-3">
      <Image src="/logo.png" alt="logo image" width={width} height={height} />
    </Link>
  );
}
