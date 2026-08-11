import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ width = 170, height = 55, showText = false, className = '' }) {
  const optimizedSrc = `https://ik.imagekit.io/iura/gadgetbds.png?tr=w-${width * 2},h-${height * 2},cm-pad_resize,q-90`;

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-transform active:scale-95 ${className}`}
      aria-label="Gadget BDs Home"
    >
      <div
        style={{ width, height }}
        className="relative flex items-center justify-between overflow-hidden"
      >
        <Image
          src={optimizedSrc}
          alt="Gadget BDs Logo"
          width={width}
          height={height}
          priority
          fetchPriority="high"
          decoding="async"
          className="object-contain w-full h-full"
          quality={100}
        />
      </div>

      {showText && (
        <span className="text-xl font-medium tracking-tighterer uppercase italic text-text ml-1">
          Gadget <span className="text-primary">BDs</span>
        </span>
      )}
    </Link>
  );
}
