import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const sizes = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm", 
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg",
  '2xl': "h-16 w-16 text-xl"
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt = '', 
  size = 'md', 
  name = '',
  fallback,
  ...props 
}, ref) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(!!src)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setImageError(false)
      setImageLoading(true)
      setImageLoaded(false)
    } else {
      setImageLoading(false)
      setImageLoaded(false)
    }
  }, [src])
  
  const handleImageError = (e) => {
    console.warn('Avatar image loading error:', e.target?.src || src)
    setImageError(true)
    setImageLoading(false)
    setImageLoaded(false)
  }
  
  const handleImageLoad = () => {
    setImageLoading(false)
    setImageLoaded(true)
    setImageError(false)
  }

  const shouldShowImage = src && !imageError && imageLoaded
  const displayInitials = getInitials(name || alt)
  const displayFallback = fallback || displayInitials

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 select-none avatar-image",
        sizes[size],
        imageLoading && "image-loading",
        imageLoaded && "image-ready",
        className
)}
      {...props}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          style={{ 
            minWidth: '1px', 
            minHeight: '1px',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      ) : null}
      
      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {/* Fallback content - shown when no image, loading, or error */}
      {(!shouldShowImage || imageLoading) && (
        <span className={cn(
          "font-medium",
          imageLoading && "opacity-0"
)}>
          {displayFallback}
        </span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'