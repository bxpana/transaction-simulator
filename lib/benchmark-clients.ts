import { createWalletClient, createPublicClient } from "viem";
import { Account } from "viem/accounts";
import { abstractTestnet } from "viem/chains";
import { eip712WalletActions, publicActionsL2 } from "viem/zksync";
import { createInstrumentedTransport, RPCCallLog } from "@/lib/instrumented-transport";

export function createBenchmarkClients(
  account: Account,
  rpcCallLogger: (log: RPCCallLog) => void,
  rpcStartLogger?: (log: Omit<RPCCallLog, 'endTime' | 'duration'>) => void,
  prefetchChainId: boolean = false
) {
  // Get the RPC URL from the abstractTestnet chain
  const rpcUrl = abstractTestnet.rpcUrls.default.http[0];

  const walletClient = createWalletClient({
    account,
    chain: abstractTestnet,
    transport: createInstrumentedTransport(rpcUrl, rpcCallLogger, rpcStartLogger, prefetchChainId, abstractTestnet.id),
  }).extend(eip712WalletActions());

  const publicClient = createPublicClient({
    chain: abstractTestnet,
    transport: createInstrumentedTransport(rpcUrl, rpcCallLogger, rpcStartLogger),
  }).extend(publicActionsL2());

  return { walletClient, publicClient };
}


