import React from 'react';

export default function BrandLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" stroke="#00BCD4" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M8 22 C8 18 10 16 12 14 L14 10 L16 8 L18 10 L20 14 C22 16 24 18 24 22" stroke="#00BCD4" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M12 22 L12 26 M16 22 L16 27 M20 22 L20 26" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="8" r="3" fill="#00BCD4" opacity="0.8" />
      <path d="M14 14 L18 14" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
