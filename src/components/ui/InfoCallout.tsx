interface InfoCalloutProps {
  type: "info" | "warn" | "tip";
  children: React.ReactNode;
}

const ICONS: Record<InfoCalloutProps["type"], string> = {
  info: "ℹ",
  warn: "⚠",
  tip: "💡",
};

export default function InfoCallout({ type, children }: InfoCalloutProps) {
  return (
    <div className={`callout callout-${type}`} role={type === "warn" ? "alert" : "note"}>
      <span aria-hidden="true">{ICONS[type]}</span>
      <span>{children}</span>
    </div>
  );
}
