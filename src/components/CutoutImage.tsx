import React, { useEffect, useState } from 'react';
import { IceCreamCone } from 'lucide-react';
import { processStudioCutout } from '../utils/imageCutout';

interface CutoutImageProps {
  src: string;
  alt: string;
  className?: string;
  accentColor?: string;
  loading?: 'eager' | 'lazy';
  enableCutout?: boolean;
}

export function CutoutImage({
  src,
  alt,
  className = '',
  accentColor = '#f3c9d4',
  loading = 'eager',
  enableCutout = true,
}: CutoutImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setResolvedSrc(src);
    if (!enableCutout) return;

    let cancelled = false;
    processStudioCutout(src).then((cutoutUrl) => {
      if (!cancelled && cutoutUrl) {
        setResolvedSrc(cutoutUrl);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src, enableCutout]);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center ${className}`}
        style={{
          background: `radial-gradient(circle at 40% 35%, ${accentColor}, #f6d5df)`,
        }}
        role="img"
        aria-label={alt}
      >
        <IceCreamCone className="w-10 h-10 text-[#3d0f1f]/70 mb-1" />
        <span className="text-xs font-medium text-[#3d0f1f]/80 line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`select-none pointer-events-none object-contain ${className}`}
      draggable={false}
    />
  );
}
