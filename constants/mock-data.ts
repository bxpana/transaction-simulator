import { RPCCallLog } from "@/lib/instrumented-transport";

/**
 * Mock RPC call data for displaying before the first benchmark run
 * Represents typical call pattern for connected wallet transactions
 */
export const MOCK_CALLS: RPCCallLog[] = [
  { method: "eth_getTransactionReceipt", startTime: 0, endTime: 236, duration: 236 },
  { method: "eth_getTransactionReceipt", startTime: 0, endTime: 233, duration: 233 },
];

/**
 * Get mock calls for display placeholder
 */
export function getMockCalls(): RPCCallLog[] {
  return MOCK_CALLS;
}
