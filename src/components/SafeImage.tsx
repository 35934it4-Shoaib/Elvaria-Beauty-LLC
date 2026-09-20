import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_FALLBACK_IMAGE } from '../data/config';
import { RefreshCw, ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  enableRetry?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'ELVARIA BEAUTY Body Care',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  className = '',
  enableRetry = true,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [autoRetried, setAutoRetried] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
    setIsRetrying(false);
    setAutoRetried(false);
  }, [src, fallbackSrc]);

  const handleError = useCallback(() => {
    // If not auto-retried yet, try once with cache buster on the original src
    if (!autoRetried && src && src !== fallbackSrc) {
      setAutoRetried(true);
      const cacheBustUrl = src.includes('?')
        ? `${src}&reload=${Date.now()}`
        : `${src}?reload=${Date.now()}`;
      setImgSrc(cacheBustUrl);
      return;
    }

    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
    }
  }, [autoRetried, src, fallbackSrc, imgSrc]);

  const handleManualReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRetrying(true);
    setHasError(false);
    
    // Choose original source or fallback to reload
    const targetBase = src || fallbackSrc;
    const retryUrl = targetBase.includes('?')
      ? `${targetBase.split('&reload=')[0].split('?reload=')[0]}&reload=${Date.now()}`
      : `${targetBase}?reload=${Date.now()}`;

    setImgSrc(retryUrl);
    setTimeout(() => {
      setIsRetrying(false);
    }, 600);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={className}
        {...props}
      />

      {hasError && enableRetry && (
        <button
          type="button"
          onClick={handleManualReload}
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 bg-[#202420]/80 hover:bg-[#202420] text-[#F7F5F0] text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md transition-all shadow-md z-20 cursor-pointer border border-white/20"
          title="Reload image"
          aria-label="Reload image"
        >
          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      )}
    </div>
  );
};
