# Transaction Latency Simulator

A real-time transaction latency benchmarking tool for EVM chains. Test how long it takes for a transaction to be confirmed on any chain — including Abstract, MegaETH, Monad, and 500+ others.

**100% open-source and unbiased.**

→ [txsim.com](https://txsim.com)

## Features

- **Real Transaction Testing**: Send actual transactions (0-value self-transfers) to measure true confirmation latency
- **Multi-Chain Support**: Test on 500+ EVM chains including Abstract, MegaETH, Monad, Base, and Ethereum testnets
- **RPC Call Breakdown**: See detailed timing for each RPC call (eth_sendTransaction, eth_getTransactionReceipt, etc.)
- **Live Updates**: Watch transaction confirmation progress in real-time
- **Wallet Integration**: Connect any wallet via RainbowKit (MetaMask, WalletConnect, Coinbase Wallet, etc.)

## How It Works

1. Connect your wallet
2. Select a chain from the featured list or search 500+ chains
3. Click "Send Transaction" and confirm in your wallet
4. Watch the timer measure actual confirmation latency

The tool sends a 0-value transaction to your own address and measures the time from when the transaction is submitted to the network until it's confirmed on-chain.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jarrodwatts/transaction-simulator.git
cd transaction-simulator

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Blockchain**: [viem](https://viem.sh/) + [wagmi](https://wagmi.sh/)
- **Wallet Connection**: [RainbowKit](https://www.rainbowkit.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
│   └── ui/                 # Reusable UI primitives
├── config/                 # Chain configurations
├── constants/              # App-wide constants
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities
│   ├── benchmark-runner.ts # Transaction execution logic
│   ├── benchmark-clients.ts # Viem client setup
│   └── instrumented-transport.ts # RPC timing capture
├── types/                  # TypeScript types
└── public/                 # Static assets (chain logos)
```

## Adding Custom Chains

To add or modify featured chains, edit `config/chains.ts`:

```typescript
export const FEATURED_CHAINS: Chain[] = [
  abstractTestnet,
  monadTestnet,
  // Add your chain here
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
