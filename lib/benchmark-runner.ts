import { Chain, WalletClient } from "viem";
import { BenchmarkResult } from "@/types/benchmark";
import { RPCCallLog } from "@/lib/instrumented-transport";
import { BenchmarkPublicClient } from "./benchmark-clients";

/**
 * Connected wallet transaction context
 */
export interface ConnectedWalletContext {
  walletClient: WalletClient;
  publicClient: BenchmarkPublicClient;
  address: `0x${string}`;
}

/**
 * Callback to notify when user has confirmed the transaction in their wallet
 */
export type OnTransactionSubmitted = (startTime: number) => void;

/**
 * Runs a transaction with a connected wallet (user signs via wallet popup)
 *
 * Note: Most wallets (MetaMask, etc.) don't support eth_signTransaction separately.
 * They only support eth_sendTransaction which signs AND sends atomically.
 *
 * This means we can't capture eth_sendRawTransaction timing - the wallet handles
 * the send internally. We CAN capture:
 * - eth_getTransactionReceipt (polling for confirmation)
 *
 * The timer starts AFTER the wallet returns the tx hash (user confirmed + sent).
 */
export async function runConnectedWalletTransaction(
  context: ConnectedWalletContext,
  chain: Chain,
  rpcCalls: RPCCallLog[],
  onTransactionSubmitted?: OnTransactionSubmitted
): Promise<BenchmarkResult> {
  try {
    // Build transaction params - self-transfer to avoid wallet warnings
    const txParams = {
      to: context.address,
      value: BigInt(0),
      account: context.address,
      chain,
    };

    // Send transaction via connected wallet
    // Timer starts AFTER this returns (user confirmed + sent to mempool)
    const hash = await context.walletClient.sendTransaction(txParams);
    const startTime = Date.now();

    // Notify that transaction was submitted (for UI to start timer)
    onTransactionSubmitted?.(startTime);

    // Wait for confirmation via instrumented client (captures RPC timing)
    await context.publicClient.waitForTransactionReceipt({ hash });
    const endTime = Date.now();

    return {
      startTime,
      endTime,
      duration: endTime - startTime,
      txHash: hash,
      status: "success",
      rpcCalls,
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      startTime: endTime,
      endTime,
      duration: 0,
      txHash: "",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      rpcCalls,
    };
  }
}
