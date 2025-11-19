import { BenchmarkResult } from "@/types/benchmark";

interface ResultCardProps {
  result: BenchmarkResult | null;
  isRunning: boolean;
  type: "async" | "sync";
}

function truncateHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function ResultCard({ result, isRunning, type }: ResultCardProps) {
  const isAsync = type === "async";
  const title = isAsync ? "Async Transaction" : "Sync Transaction (EIP-7966)";
  const subtitle = isAsync 
    ? "sendTransaction + waitForTransactionReceipt" 
    : "sendRawTransactionSync";

  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-zinc-400 font-mono">{subtitle}</p>
        </div>
        {result && (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              result.status === "success"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {result.status === "success" ? "✓ Success" : "✗ Error"}
          </span>
        )}
      </div>

      {isRunning && !result && (
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Running...</span>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {result.status === "success" ? (
            <>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-emerald-400 font-mono">
                  {result.duration}ms
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-2">RPC Call Breakdown</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {result.rpcCalls.map((call, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs bg-zinc-800/50 rounded px-2 py-1"
                    >
                      <span className="text-zinc-300 font-mono">{call.method}</span>
                      <span className="text-emerald-400 font-mono">{call.duration}ms</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Total RPC Time</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {result.rpcCalls.reduce((sum, call) => sum + call.duration, 0)}ms
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-700 flex items-center gap-2">
                <span className="text-xs text-zinc-400">Transaction Hash</span>
                <a
                  href={`https://sepolia.abscan.org/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white hover:text-emerald-300 font-mono transition-colors group"
                >
                  <span>{truncateHash(result.txHash)}</span>
                  <svg
                    className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-zinc-400 mb-1">Error</p>
              <p className="text-sm text-red-400 wrap-break-word">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

