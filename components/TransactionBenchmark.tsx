"use client";

import { useState } from "react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { RPCCallLog } from "@/lib/instrumented-transport";
import { createBenchmarkClients } from "@/lib/benchmark-clients";
import { runAsyncTransaction, runSyncTransaction } from "@/lib/benchmark-runner";
import { BenchmarkResult } from "@/types/benchmark";
import { ResultCard } from "./ResultCard";

export function TransactionBenchmark() {
  const [isRunning, setIsRunning] = useState(false);
  const [asyncResult, setAsyncResult] = useState<BenchmarkResult | null>(null);
  const [syncResult, setSyncResult] = useState<BenchmarkResult | null>(null);

  const runBenchmark = async () => {
    setIsRunning(true);
    setAsyncResult(null);
    setSyncResult(null);

    // Generate two separate accounts for a fair parallel benchmark
    const asyncAccount = privateKeyToAccount(generatePrivateKey());
    const syncAccount = privateKeyToAccount(generatePrivateKey());

    // Create separate RPC call logs for each transaction type
    const asyncRPCCalls: RPCCallLog[] = [];
    const syncRPCCalls: RPCCallLog[] = [];

    // Create clients for async transaction with its own account
    const asyncClients = createBenchmarkClients(asyncAccount, (log) => asyncRPCCalls.push(log));
    
    // Create clients for sync transaction with its own account
    const syncClients = createBenchmarkClients(syncAccount, (log) => syncRPCCalls.push(log));

    // Get starting nonces for each account independently
    const [asyncNonce, syncNonce] = await Promise.all([
      asyncClients.publicClient.getTransactionCount({
        address: asyncAccount.address,
      }),
      syncClients.publicClient.getTransactionCount({
        address: syncAccount.address,
      }),
    ]);

    // Run both transactions in parallel with no dependencies
    const [asyncRes, syncRes] = await Promise.all([
      runAsyncTransaction(
        { ...asyncClients, account: asyncAccount },
        asyncNonce,
        asyncRPCCalls
      ),
      runSyncTransaction(
        { ...syncClients, account: syncAccount },
        syncNonce,
        syncRPCCalls
      ),
    ]);

    setAsyncResult(asyncRes);
    setSyncResult(syncRes);
    setIsRunning(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-lg transition-colors"
        >
          {isRunning ? "Running Benchmark..." : "Run Benchmark"}
        </button>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          <ResultCard result={asyncResult} isRunning={isRunning} type="async" />
          <ResultCard result={syncResult} isRunning={isRunning} type="sync" />
        </div>
      </div>
    </div>
  );
}
