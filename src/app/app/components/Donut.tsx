export default function Donut({ percent, color }: { percent: number; color: string }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="relative h-14 w-14 rounded-full"
      style={{
        background: `conic-gradient(${color} ${p}%, #e5e7eb 0)`,
      }}
    >
      <div className="absolute inset-2 rounded-full bg-white" />
    </div>
  );
}
