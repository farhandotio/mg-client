import Image from 'next/image';
import Link from 'next/link';

export default function Logo({
  width = 180,
  height = 60,
  showText = false,
  className = '',
  useLink = true,
}) {
  const content = (
    <>
      <div
        style={{ width, height }}
        className="relative flex items-center justify-between overflow-hidden"
      >
        <Image
          src="/logo.png"
          alt="My Gadget Logo"
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
          My <span className="text-primary">Gadget</span>
        </span>
      )}
    </>
  );

  if (!useLink) {
    return (
      <div
        className={`flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-transform active:scale-95 ${className}`}
        aria-label="My Gadget Home"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-transform active:scale-95 ${className}`}
      aria-label="My Gadget Home"
    >
      {content}
    </Link>
  );
}
