# 🍪 CookiePay — Fast Web3 Tipping, Invoicing & Micro-Actions on Cookie Chain

![CookiePay Banner](https://img.shields.io/badge/Cookie%20Chain-SVM%20Compatible-amber?style=for-the-badge&logo=cookie)
![Nightly Wallet](https://img.shields.io/badge/Wallet-Nightly%20Required-blue?style=for-the-badge)
![Finality](https://img.shields.io/badge/Finality-%3C0.5s-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

> Built for the **Superteam Earn: "Create an App on Cookie Chain"** Bounty ($1,000 USDC).

---

## 🌟 Overview

**CookiePay** is a high-speed decentralized tipping, peer-to-peer payments, and dynamic invoicing application natively designed for the **Cookie Chain (SVM)** ecosystem. 

Cookie Chain's sub-second finality and sub-cent fees make traditional Web2 payment flows (like tipping creators, splitting bills, or settling merchant invoices) 100x cheaper and instantaneous without the high gas overhead of Ethereum or congestion of mainnet.

---

## ✨ Features

1. **🦊 Nightly Wallet First**:
   * Direct integration with Nightly Wallet (`window.nightly.solana` & Solana Wallet Standard).
   * Real-time $COOK balance tracking and auto-reconnect.
   * Graceful installation prompts and fallback detection.

2. **⚡ Instant P2P Tipping & Payments**:
   * Transfer native **$COOK** to any Base58 address.
   * Preset quick-tip buttons (+1, +5, +25, +100 COOK).
   * Built-in **On-Chain Memo** support — messages and references are permanently inscribed on Cookie Chain and viewable on [Cookiescan](https://cookiescan.io).

3. **📱 Dynamic QR Invoices & Shareable Links**:
   * Generate Solana Pay-style QR codes for instant mobile camera / Nightly scanning.
   * Create shareable payment links with URL query parameters (`?to=...&amount=...&memo=...`).
   * One-click copy link and download QR as PNG.

4. **🥠 On-Chain Fortune Cookie (Micro-Action)**:
   * An interactive gamified demonstration of Cookie Chain's performance.
   * Cracking a cookie signs a micro-transaction on-chain, triggering celebration confetti and stamping a randomized cryptographic Web3 fortune on Cookiescan.

5. **📡 Real-Time Network Radar**:
   * Live telemetry pinging `https://rpc.cookiescan.io`.
   * Displays Slot Height, RPC Latency (ms), Average Network Fee (< 0.00001 COOK), and estimated gas savings vs Ethereum L1 ($4.85+ saved per tx).

6. **🗄️ Cookie DAS API (Digital Asset Standard) & Ecosystem Integration**:
   * Live query layer connected to `https://api.cookiescan.io` using JSON-RPC `getAssetsByOwner`.
   * Real-time compressed asset inspector and one-click shortcuts to **Cookieswap** (`https://swap.cookiechain.wtf`).

7. **🌉 In-App Quickstart & Bridge Guide**:
   * Complete onboarding modal for judges and users: Nightly configuration parameters, bridging instructions, and zero-friction test presets (Loopback Self-test, Community Treasury).

8. **📜 Session Transaction Ledger**:
   * Instant local history of all payments, tips, and fortunes with direct links to `https://cookiescan.io/tx/{signature}`.

---

## 🛠️ Network Configuration

| Property | Value |
| :--- | :--- |
| **Network Name** | Cookie Chain |
| **Architecture** | SVM (Solana Virtual Machine compatible) |
| **RPC Endpoint** | `https://rpc.cookiescan.io` |
| **Block Explorer** | [https://cookiescan.io](https://cookiescan.io) |
| **DAS API** | [https://api.cookiescan.io](https://api.cookiescan.io) |
| **Native Token** | $COOK (9 decimals, 1 COOK = 10^9 lamports) |
| **Average Fee** | ~0.000005 COOK (~$0.00001 USD) |

---

## 🚀 How to Run Locally

### Prerequisites
* **Node.js**: v18+ (tested on Node v25)
* **Nightly Wallet**: Browser extension installed from [nightly.app](https://nightly.app)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/cookiepay.git
cd cookiepay

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌉 Cookie Chain Bridge & Funding Directions

To test CookiePay with live $COOK tokens on Cookie Chain:
1. Ensure your Nightly Wallet has the Cookie Chain network added, or connect Nightly to [Cookiescan](https://cookiescan.io).
2. Bridge funds or swap via **Cookieswap** or the official bridge (see [docs.cookiechain.wtf](https://docs.cookiechain.wtf)).
3. Connect your wallet to **CookiePay**, enter an address, and send a tip or crack a fortune cookie!

---

## 🧵 Submission X (Twitter) Thread Draft

```text
1/4 🍪 Introducing CookiePay: Sub-second payments, tips & dynamic QR invoicing on @CookieChain!

Built for the @SuperteamEarn $1,000 USDC Bounty with @Nightly_app wallet integration. 🚀

Live App: [YOUR_DEPLOYED_URL]
GitHub: https://github.com/ayodejierioluwa/cookiepay

2/4 Why CookiePay on Cookie Chain?
Traditional payments suffer from slow settlement and high gas. With Cookie Chain's SVM sub-second finality and sub-cent fees:
⚡ Instant P2P $COOK tips with on-chain memos
📱 Solana-Pay style QR invoices & shareable paylinks
📡 Live network telemetry & gas calculator

3/4 🥠 We also built "On-Chain Fortune Cookies":
Demonstrating Cookie Chain's speed in real-time — users crack a cookie, sign a micro-tx, and stamp their Web3 fortune directly onto Cookiescan with zero friction!

4/4 🌉 How to test:
1. Open Nightly Wallet & switch to Cookie Chain
2. Grab some $COOK on Cookieswap / Bridge (docs.cookiechain.wtf)
3. Connect & experience payments at the speed of light!

Huge thanks to @CookieChain and @SuperteamEarn! 🍪🔥
```

---

## 📄 License
MIT License. Open-source and built for the Solana / Cookie Chain developer community.
