/**
 * Onboarding V2 Layout
 * 
 * Custom layout with no sidebar for immersive onboarding experience
 */

export default function OnboardingV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {children}
    </div>
  );
}

