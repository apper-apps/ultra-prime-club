import { forwardRef, useState } from 'react'
import { cn } from '@/utils/cn'

const sizes = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg',
  '2xl': 'h-16 w-16 text-xl',
}

const getInitials = (name) => {
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
  name, 
  size = 'md', 
  className,
  ...props 
}, ref) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }
  
  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Validate image src
  const isValidSrc = src && typeof src === 'string' && src.trim() !== ''

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold shrink-0",
        sizes[size],
className
      )}
      {...props}
    >
      {isValidSrc && !imageError ? (
        <>
          <img 
            src={src} 
            alt={alt || name || 'Avatar'} 
            className="w-full h-full rounded-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          {imageLoading && (
            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-400 text-xs">...</span>
            </div>
          )}
        </>
      ) : null}
      {(!isValidSrc || imageError || (imageLoading && isValidSrc)) && (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar