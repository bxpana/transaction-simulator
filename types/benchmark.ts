import { RPCCallLog } from "@/lib/instrumented-transport";

export interface BenchmarkResult {
  startTime: number;
  endTime: number;
  duration: number;
  txHash: string;
  status: "success" | "error";
  error?: string;
  rpcCalls: RPCCallLog[];
  syncMode: boolean;
  /**
   * Block inclusion details to understand if latency comes from miniblock slips or receipt fetch.
   */
  inclusion?: {
    sendBlockNumber: bigint;
    receiptBlockNumber?: bigint;
    blockDelta?: number;
    inclusionLatencyMs?: number;
  };
}
