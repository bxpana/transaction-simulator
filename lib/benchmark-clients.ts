import { createWalletClient, createPublicClient } from "viem";
import { Account } from "viem/accounts";
import { abstractTestnet } from "viem/chains";
import { eip712WalletActions, publicActionsL2 } from "viem/zksync";
import { createInstrumentedTransport, RPCCallLog } from "@/lib/instrumented-transport";

export function createBenchmarkClients(
  account: Account,
  rpcCallLogger: (log: RPCCallLog) => void
) {
  const walletClient = createWalletClient({
    account,
    chain: abstractTestnet,
    transport: createInstrumentedTransport(undefined, rpcCallLogger),
  }).extend(eip712WalletActions());

  const publicClient = createPublicClient({
    chain: abstractTestnet,
    transport: createInstrumentedTransport(undefined, rpcCallLogger),
  }).extend(publicActionsL2());

  return { walletClient, publicClient };
}

