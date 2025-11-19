'use client';

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { abstractWallet } from "@abstract-foundation/agw-react/connectors";
import { createConfig } from "wagmi";
import { abstractTestnet, abstract } from "wagmi/chains"; // Use abstract for mainnet
import { createClient, http } from "viem";
import { eip712WalletActions } from "viem/zksync";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Abstract",
      wallets: [abstractWallet],
    },
  ],
  {
    appName: "Rainbowkit Test",
    projectId: "",
    appDescription: "",
    appIcon: "",
    appUrl: "",
  }
);

export const config = createConfig({
  connectors,
  chains: [abstractTestnet],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    }).extend(eip712WalletActions());
  },
  ssr: true,
});