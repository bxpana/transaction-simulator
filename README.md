# Transaction Simulator

A small Next.js app plus a CLI batch runner to measure `eth_sendRawTransactionSync` latency (and compare against async send + wait). It uses the Abstract testnet RPC and the paymaster configured in `config/paymaster-config.ts`.

## Prerequisites
- `pnpm` (recommended)
- RPC endpoint: defaults to `abstractTestnet` from `viem/chains`. Adjust in `lib/benchmark-clients.ts` if needed.
- Paymaster: set in `config/paymaster-config.ts` (currently `0x5407B5040dec3D339A9247f3654E59EEccbb6391` with general paymaster input).

Install deps:
```bash
pnpm install
```

## Web demo (single tx, interactive)
```bash
pnpm dev
```
Open http://localhost:3000 and toggle:
- Sync mode (uses `eth_sendRawTransactionSync`)
- Prefetch nonce/gas/chain ID (to reduce setup overhead)

Result card shows:
- Per-RPC call durations
- Inclusion details: send block, receipt block, block delta, inclusion wait (ms)

## CLI batch runner (100 txs)
Runs multiple txs and prints per-tx lines plus p50/p90/p99 summaries.

```bash
# 100 sync txs (eth_sendRawTransactionSync)
pnpm benchmark:batch -- --count 100

# 100 async txs (sendRawTransaction + waitForTransactionReceipt)
pnpm benchmark:batch -- --count 100 --async
```

Per-tx log format:
```
#17/100 hash=0x... total=1280ms blockDelta=1 inclusionWait=950ms
```

Summary shows:
- Total wall time for the batch
- Duration p50/p90/p99 (overall end-to-end)
- Inclusion wait p50/p90/p99 (time spent waiting for inclusion/receipt)
- Block delta avg/max (how many miniblocks slipped)

## How to interpret results
- Block delta 0–1 but inclusionWait ~1s+: likely polling interval in the sync handler or miniblock cadence stretching; not heavy mempool queueing.
- Block delta grows (>3): txs are missing multiple miniblocks; check sequencer sealing/backpressure.
- Async vs sync: if async p99 ≪ sync p99 with similar block deltas, the sync RPC is polling too slowly. If both are high, inclusion itself is slow (sequencer/DB/backlog).
- Compare inclusionWait to miniblock target (200ms): a 1s wait with delta=1 implies ~1s seal or ~1s polling interval.

## Configuration knobs
- RPC URL/chain: edit `lib/benchmark-clients.ts` (uses `abstractTestnet.rpcUrls.default.http[0]`).
- Paymaster: `config/paymaster-config.ts`.
- Batch size and mode: CLI flags `--count N`, `--async`.
- Prefetch behavior (web UI only): toggle nonce/gas/chain ID to isolate RPC setup costs from inclusion time.

## Troubleshooting
- If you hit rate limits (LB is 1000 rps), lower `--count` or add delays between runs.
- For local node testing, point `rpcUrl` in `lib/benchmark-clients.ts` to `http://localhost:PORT` and rerun to separate network/LB effects.
