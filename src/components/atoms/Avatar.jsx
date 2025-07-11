import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const sizes = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm', 
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg',
  '2xl': 'h-16 w-16 text-xl'
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const Avatar = forwardRef(({ 
  src, 
  alt, 
  size = 'md', 
  className, 
  name,
  ...props 
}, ref) => {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)

  useEffect(() => {
    if (src) {
      setImgError(false)
      setImgLoaded(false)
      setImgLoading(true)
    } else {
      setImgLoading(false)
    }
  }, [src])

  const handleImageLoad = () => {
    setImgLoaded(true)
    setImgLoading(false)
  }

  const handleImageError = () => {
    setImgError(true)
    setImgLoaded(false)
    setImgLoading(false)
  }

  // Validate image source before rendering
  const shouldShowImage = src && !imgError && typeof src === 'string' && src.trim() !== ''

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden viewport-capture-ready',
        sizes[size],
        className
      )}
      {...props}
    >
      {shouldShowImage ? (
        <>
          {/* Loading state */}
          {imgLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-full" />
          )}
          
          {/* Image */}
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'w-full h-full object-cover rounded-full image-ready',
              imgLoaded ? 'opacity-100' : 'opacity-0',
              'transition-opacity duration-300'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            style={{
              minWidth: '1px',
              minHeight: '1px'
            }}
          />
          
          {/* Fallback initials (shown during load or on error) */}
          {(!imgLoaded || imgError) && (
            <span className={cn(
              'absolute inset-0 flex items-center justify-center font-medium text-gray-600 bg-gray-100 rounded-full',
              sizes[size]
            )}>
              {getInitials(name)}
            </span>
          )}
        </>
      ) : (
        /* Initials fallback when no valid image source */
        <span className={cn(
          'font-medium text-gray-600',
          sizes[size]
        )}>
          {getInitials(name)}
        </span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar