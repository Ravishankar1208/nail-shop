import { useEffect, useState } from 'react';

const DEFAULT_FALLBACK = '/nail-placeholder.svg';

function ImageWithFallback({ src, alt, className = '', ...props }) {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_FALLBACK);

  useEffect(() => {
    setImageSrc(src || DEFAULT_FALLBACK);
  }, [src]);

  return (
    <img
      {...props}
      className={className}
      src={imageSrc}
      alt={alt || 'Product image'}
      loading="lazy"
      onError={() => {
        if (imageSrc !== DEFAULT_FALLBACK) {
          setImageSrc(DEFAULT_FALLBACK);
        }
      }}
    />
  );
}

export default ImageWithFallback;
