import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/main" className="flex items-center gap-2">
      <Image src="/test.svg" alt="logo image" width={40} height={40} />
      <h1>VoiceMark</h1>
    </Link>
    
  );
}
