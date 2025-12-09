import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { RPCCallLog } from "@/lib/instrumented-transport";
import { createBenchmarkClients } from "@/lib/benchmark-clients";
import { runTransaction, TransactionOptions } from "@/lib/benchmark-runner";

interface BatchResult {
  duration: number;
  inclusionWait?: number;
  blockDelta?: number;
  txHash: string;
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * (p / 100);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (upper === lower) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

function formatMs(value?: number): string {
  return value !== undefined ? `${value}ms` : "-";
}

async function main() {
  const args = process.argv.slice(2);
  const countArgIndex = args.findIndex((arg) => arg === "--count");
  const count = countArgIndex >= 0 ? Number(args[countArgIndex + 1]) || 100 : 100;
  const sync = !args.includes("--async");

  const options: TransactionOptions = {
    nonce: false,
    gasParams: false,
    chainId: false,
    syncMode: sync,
  };

  const results: BatchResult[] = [];
  const start = Date.now();
  console.log(`Running ${count} transactions in ${sync ? "SYNC" : "ASYNC"} mode...`);

  for (let i = 0; i < count; i++) {
    const account = privateKeyToAccount(generatePrivateKey());
    const rpcCalls: RPCCallLog[] = [];

    const clients = createBenchmarkClients(account, () => {}, undefined, options.chainId);

    const txResult = await runTransaction(
      { ...clients, account },
      0,
      rpcCalls,
      options,
      null
    );

    results.push({
      duration: txResult.duration,
      inclusionWait: txResult.inclusion?.inclusionLatencyMs,
      blockDelta: txResult.inclusion?.blockDelta,
      txHash: txResult.txHash,
    });

    console.log(
      `#${i + 1}/${count} hash=${txResult.txHash} total=${txResult.duration}ms blockDelta=${txResult.inclusion?.blockDelta ?? "-"} inclusionWait=${formatMs(txResult.inclusion?.inclusionLatencyMs)}`
    );
  }

  const end = Date.now();

  const durations = results.map((r) => r.duration);
  const inclusionWaits = results.map((r) => r.inclusionWait).filter((v): v is number => v !== undefined);
  const deltas = results.map((r) => r.blockDelta).filter((v): v is number => v !== undefined);

  console.log("\n=== Summary ===");
  console.log(`Mode: ${sync ? "SYNC (eth_sendRawTransactionSync)" : "ASYNC (send + wait)"}`);
  console.log(`Total wall time: ${end - start}ms for ${count} txs`);
  console.log(`Duration p50/p90/p99: ${percentile(durations, 50)} / ${percentile(durations, 90)} / ${percentile(durations, 99)} ms`);
  if (inclusionWaits.length > 0) {
    console.log(`Inclusion wait p50/p90/p99: ${percentile(inclusionWaits, 50)} / ${percentile(inclusionWaits, 90)} / ${percentile(inclusionWaits, 99)} ms`);
  }
  if (deltas.length > 0) {
    const maxDelta = Math.max(...deltas);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    console.log(`Block delta avg/max: ${avgDelta.toFixed(2)} / ${maxDelta}`);
  }
}

main().catch((err) => {
  console.error("Batch run failed:", err);
  process.exit(1);
});
