import React from 'react';

export default function Button({
  text,
  href,
  url,
  icon: Icon,
  size = 'md',
  bgColor = 'bg-primary',
  className = '',
  ...props
}) {
  const sizeClasses =
    size === 'xs'
      ? 'h-7 px-3 text-xs'
      : size === 'sm'
      ? 'h-8 px-4 text-sm'
      : size === 'lg'
      ? 'h-12 px-8 text-base'
      : size === 'xl'
      ? 'h-14 px-10 text-lg'
      : 'h-10 px-6 text-sm';

  const baseClasses = `relative inline-flex items-center gap-3 overflow-hidden group font-semibold justify-center text-pText whitespace-nowrap ${bgColor} hover:from-primary hover:to-card transition-colors w-full cursor-pointer shadow-lg ${
    bgColor === 'bg-primary' ? 'shadow-primary/50 text-white' : 'shadow-card border border-border'
  } ${sizeClasses} ${className}`;

  const innerSpanClasses = `absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/60 to-transparent pointer-events-none`;

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
        <span>{text}</span>
        <span className={innerSpanClasses}></span>
      </a>
    );
  }

  if (url) {
    if (url.startsWith('http') || url.startsWith('#')) {
      return (
        <a
          href={url}
          className={baseClasses}
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
          <span>{text}</span>
          <span className={innerSpanClasses}></span>
        </a>
      );
    }

    return (
      <Link to={url} className={baseClasses} {...props}>
        {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
        <span>{text}</span>
        <span className={innerSpanClasses}></span>
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses} {...props}>
      {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
      <span>{text}</span>
      <span className={innerSpanClasses}></span>
    </button>
  );
}
