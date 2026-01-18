import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ width = 140, height = 40, showText = false, className = '' }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="https://ik.imagekit.io/iura/gadgetbds.png"
        alt="Gadget BDs Logo"
        width={width}
        height={height}
        fetchPriority="high"
        quality={90}
        priority
      />

      {showText && <span className="text-lg font-semibold tracking-wide">Gadget BDs</span>}
    </Link>
  );
}
