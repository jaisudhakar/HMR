'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Photo } from '@/data/photos';

type Props = {
  photo?: Photo;
  /** Text for the typographic tile shown when a dish has no photo. */
  label?: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A cover image that tries each source in turn and falls back to an elegant tile. */
export function Img({ photo, label, alt, sizes, priority, className }: Props) {
  const [i, setI] = useState(0);
  const src = photo?.src[i];
  if (!src) {
    return label ? (
      <span className="ph" aria-hidden="true">
        <span>{label}<small>HMR Kitchen</small></span>
      </span>
    ) : (
      <span className="img-fallback" aria-hidden="true" />
    );
  }
  return (
    <Image
      key={src}
      src={src}
      alt={alt ?? photo?.alt ?? ''}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setI(n => n + 1)}
    />
  );
}
