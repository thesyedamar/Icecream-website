import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  outlinedLine: string;
  solidLine: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  outlinedLine,
  solidLine,
  align = 'center',
  theme = 'light',
}: SectionHeadingProps) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  const eyebrowColor = theme === 'dark' ? 'text-[#f2b544]' : 'text-[#5a1a2e]';
  const outlineCls = theme === 'dark' ? 'text-stroke-cream' : 'text-stroke-burgundy';
  const solidColor = theme === 'dark' ? 'text-[#fcecf0]' : 'text-[#3d0f1f]';

  return (
    <div className={`flex flex-col ${alignCls}`}>
      <p
        className={`text-xs sm:text-[13px] font-semibold uppercase tracking-[0.28em] mb-3 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2 className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl text-balance">
        <span className={`block ${outlineCls}`}>{outlinedLine}</span>
        <span className={`block mt-1 ${solidColor}`}>{solidLine}</span>
      </h2>
    </div>
  );
}
