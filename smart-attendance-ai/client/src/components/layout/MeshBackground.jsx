export default function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="mesh-blob -left-20 top-10 h-[420px] w-[420px] animate-float bg-rose-500/25" />
      <div className="mesh-blob right-0 top-1/4 h-[360px] w-[360px] animate-float-delayed bg-violet-600/20" />
      <div className="mesh-blob bottom-0 left-1/3 h-[300px] w-[300px] bg-fuchsia-500/15" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-40" />
    </div>
  );
}
