import { RPCCallLog } from "@/lib/instrumented-transport";

export interface BenchmarkResult {
  type: "async" | "sync";
  startTime: number;
  endTime: number;
  duration: number;
  txHash: string;
  status: "success" | "error";
  error?: string;
  rpcCalls: RPCCallLog[];
}

