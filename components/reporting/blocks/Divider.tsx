interface DividerProps {
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export default function Divider({ label, style = 'solid' }: DividerProps) {
  const borderStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (label) {
    return (
      <div className="relative flex items-center py-4">
        <div className={`flex-grow border-t-2 ${borderStyles[style]} border-slate-200`} />
        <span className="flex-shrink mx-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`flex-grow border-t-2 ${borderStyles[style]} border-slate-200`} />
      </div>
    );
  }

  return (
    <div className={`border-t-2 ${borderStyles[style]} border-slate-200 my-6`} />
  );
}

