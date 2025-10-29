interface ReportHeadingProps {
  text: string;
  level?: 2 | 3;
}

export default function ReportHeading({ text, level = 2 }: ReportHeadingProps) {
  if (level === 2) {
    return (
      <h2 className="text-xl font-semibold text-slate-900">
        {text}
      </h2>
    );
  }

  return (
    <h3 className="text-lg font-semibold text-slate-900">
      {text}
    </h3>
  );
}







