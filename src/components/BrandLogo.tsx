import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md';
}

export function BrandLogo({ variant = 'dark', size = 'md' }: BrandLogoProps) {
  const primary = variant === 'light' ? '#fcecf0' : '#3d0f1f';
  const secondary = variant === 'light' ? '#f2b544' : '#5a1a2e';
  const swirlFill = variant === 'light' ? '#f3c9d4' : '#e86f8c';

  const iconSize = size === 'sm' ? 'w-7 h-9' : 'w-8 h-10';
  const titleSize = size === 'sm' ? 'text-xl' : 'text-2xl';

  return (
    <span className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      <svg
        viewBox="0 0 44 56"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
        fill="none"
      >
        {/* Soft-serve swirl dome */}
        <path
          d="M22 4C23.5 9.5 30 11 29.5 16.5C33.5 17.5 35.5 21.5 33 25C36.5 26.5 37.5 31 33.5 33.5H10.5C6.5 31 7.5 26.5 11 25C8.5 21.5 10.5 17.5 14.5 16.5C14 11 20.5 9.5 22 4Z"
          fill={swirlFill}
          stroke={primary}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M13 24.5C17 26.5 27 26.5 31 24.5"
          stroke={primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15.5 17C19 18.8 25 18.8 28.5 17"
          stroke={primary}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        {/* Waffle cone */}
        <path
          d="M11 33.5H33L22 53L11 33.5Z"
          fill={secondary}
          stroke={primary}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M16 34L25 46M28 34L19 46"
          stroke={variant === 'light' ? '#3d0f1f' : '#fcecf0'}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display italic font-bold tracking-tight ${titleSize}`}
          style={{ color: primary }}
        >
          Swirl
        </span>
        <span
          className="text-[9px] font-semibold tracking-[0.34em] uppercase mt-0.5"
          style={{ color: variant === 'light' ? '#f3c9d4' : '#5a1a2e' }}
        >
          CREAMERY
        </span>
      </span>
    </span>
  );
}
