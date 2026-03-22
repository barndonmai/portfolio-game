interface LoadingScreenProps {
  progress: number;
  visible: boolean;
}

export function LoadingScreen({
  progress,
  visible,
}: LoadingScreenProps) {
  const percent = Math.round(progress * 100);
  const fillWidth = `${percent}%`;

  return (
    <div
      className={[
        'pointer-events-none fixed inset-0 z-50 transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      aria-hidden={!visible}
    >
      <div className="absolute inset-0 bg-[rgba(236,247,243,0.05)] backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_48%)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="border border-[rgba(255,255,255,0.18)] bg-[rgba(14,10,9,0.34)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm">
            <div className="relative h-6 border border-[#2c211d] bg-[rgba(255,255,255,0.08)]">
              <div
                className="h-full"
                style={{
                  width: fillWidth,
                  background:
                    'linear-gradient(180deg,#f5e59e 0%,#f0c27b 46%,#d39c63 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.35), 0 0 10px rgba(240,194,123,0.16)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-white">
                Loading
              </div>
            </div>
          </div>

          <div
            className="mt-3 text-center font-display text-sm uppercase tracking-[0.35em] text-white/90"
            style={{
              textShadow:
                '2px 0 0 rgba(27,18,15,0.6), -2px 0 0 rgba(27,18,15,0.6), 0 2px 0 rgba(27,18,15,0.6), 0 -2px 0 rgba(27,18,15,0.6)',
            }}
          >
            {percent}%
          </div>
        </div>
      </div>
    </div>
  );
}
