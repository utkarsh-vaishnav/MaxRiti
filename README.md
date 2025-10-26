# 🛠️ Decentralized Task Management & Payment Platform

A decentralized task creation and payment platform built using **Vite + React (JavaScript)** for the frontend, with **Reown** for wallet connectivity and **Pyth SDK** for real-time cryptocurrency price data. The system ensures secure, transparent, and fair task-based transactions through smart contracts and an admin-based dispute resolution mechanism.

---

## 🚀 Overview

This platform enables users to create and complete tasks while handling payments securely on the blockchain.  
Users can pay in any supported cryptocurrency (e.g., ETH or others), which is automatically **swapped into PayPal USD stablecoin** and stored in a **smart contract** until the task is completed.  
When the task is verified as complete, the payment is released to the doer in PayPal USD stablecoin.

---

## ⚙️ Key Features

### 🔸 Task Creation & Payments
- Any user can create a task and choose to pay in their preferred cryptocurrency.  
- The chosen crypto is **converted into PayPal USD stablecoin** and held in a **secure smart contract** as escrow.  
- Once the task is completed, the stablecoin is released to the doer (task performer) as payment.

### 🔸 Real-Time Crypto Pricing
- Integrated **Pyth SDK** fetches **live price data** for accurate crypto-to-stablecoin conversion during payment.  
- This ensures fair value locking at the time of task creation.

### 🔸 Wallet Connectivity
- Utilizes **Reown** for smooth and secure wallet integration, allowing users to connect and manage transactions directly from their crypto wallets.

### 🔸 Dispute Resolution System
To ensure fairness and prevent fraud:
- If a **creator** falsely claims poor task quality to avoid payment, the **doer** can raise a dispute.  
- If a **doer** fails to deliver quality work but demands payment, the **creator** can raise a dispute.  
- In both cases, an **admin** acts as a mediator:
  - ✅ If the task is completed properly → funds released to doer.  
  - ❌ If the task is not completed properly → funds refunded to creator.

---

## 🧱 Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend Framework** | Vite + React (JavaScript) |
| **Wallet Integration** | Reown |
| **Price Feed** | Pyth SDK |
| **Smart Contracts** | Solidity (Ethereum-compatible) |
| **Stablecoin Used** | PayPal USD Stablecoin |
| **Blockchain Interaction** | Web3 / Ethers.js |

---

## 🔐 Smart Contract Flow

1. **Task Creation:**  
   - Creator defines task details and payment amount.  
   - Creator pays using preferred cryptocurrency.

2. **Stablecoin Conversion:**  
   - The paid crypto is automatically swapped to **PayPal USD stablecoin**.  
   - The stablecoin is held in escrow within the smart contract.

3. **Task Completion:**  
   - Doer completes the task and submits for verification.

4. **Dispute Handling (if any):**  
   - Either party can raise a dispute.  
   - Admin reviews evidence and makes a final judgment.

5. **Payment Settlement:**  
   - If work is verified → funds go to the doer.  
   - If rejected → funds return to the creator.

---

## 🧩 Architecture Overview

