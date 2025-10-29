interface ReportTextProps {
  content: string;
}

export default function ReportText({ content }: ReportTextProps) {
  return (
    <div className="text-sm text-slate-700 leading-relaxed">
      {content.split('\n').map((paragraph, index) => (
        <p key={index} className={index > 0 ? 'mt-3' : ''}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}







