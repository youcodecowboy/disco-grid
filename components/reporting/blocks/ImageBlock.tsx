interface ImageBlockProps {
  src: string;
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export default function ImageBlock({ src, alt, caption, size = 'medium' }: ImageBlockProps) {
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full',
  };

  return (
    <div className="space-y-2">
      <div className={`${sizeClasses[size]} mx-auto`}>
        <img
          src={src}
          alt={alt || 'Report image'}
          className="w-full h-auto rounded-lg border border-slate-200"
        />
      </div>
      {caption && (
        <p className="text-sm text-slate-600 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
}








