import { zeroAddress } from "viem";
import { Account } from "viem/accounts";
import { paymasterConfig } from "@/config/paymaster-config";
import { BenchmarkResult } from "@/types/benchmark";
import { RPCCallLog } from "@/lib/instrumented-transport";

interface TransactionClients {
  walletClient: any; // Extended with eip712WalletActions
  publicClient: any; // Extended with publicActionsL2
}

export async function runAsyncTransaction(
  clients: TransactionClients & { account: Account },
  nonce: number,
  rpcCalls: RPCCallLog[]
): Promise<BenchmarkResult> {
  const startTime = Date.now();
  
  try {
    const hash = await clients.walletClient.sendTransaction({
      to: zeroAddress,
      value: BigInt(0),
      nonce,
      ...paymasterConfig,
    });

    await clients.publicClient.waitForTransactionReceipt({ hash });
    const endTime = Date.now();

    return {
      type: "async",
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
      type: "async",
      startTime,
      endTime,
      duration: endTime - startTime,
      txHash: "",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      rpcCalls,
    };
  }
}

export async function runSyncTransaction(
  clients: TransactionClients & { account: Account },
  nonce: number,
  rpcCalls: RPCCallLog[]
): Promise<BenchmarkResult> {
  const startTime = Date.now();
  
  try {
    const request = await clients.walletClient.prepareTransactionRequest({
      to: zeroAddress,
      value: BigInt(0),
      nonce,
      ...paymasterConfig,
    });

    const serializedTransaction = await clients.walletClient.signTransaction(request);
    
    const receipt = await clients.publicClient.sendRawTransactionSync({
      serializedTransaction,
    });

    const endTime = Date.now();

    return {
      type: "sync",
      startTime,
      endTime,
      duration: endTime - startTime,
      txHash: receipt.transactionHash,
      status: "success",
      rpcCalls,
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      type: "sync",
      startTime,
      endTime,
      duration: endTime - startTime,
      txHash: "",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      rpcCalls,
    };
  }
}

