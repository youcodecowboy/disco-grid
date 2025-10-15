interface SpacerProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Spacer({ size = 'medium' }: SpacerProps) {
  const heights = {
    small: 'h-4',
    medium: 'h-8',
    large: 'h-16',
  };

  return <div className={heights[size]} />;
}

