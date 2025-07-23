# FAQ and glossary for funding apps

## FAQ

### How is pricing determined?

Fees are usage-based—the contract multiplies message bytes by a base rate that adjusts with network congestion. At launch, the effective cost is about 0.001 USDC for a 1 KB text message (≈ $1 per 1,000 small messages). Governance can update the base rate over time.

### What gas costs apply?

Each message triggers an L3 commit; at ≤ 500 gwei that works out to fractions of a cent. Portal shows live estimates before you send.

### What happens when my balance hits zero?

The PayerRegistry rejects new messages and returns `INSUFFICIENT_PAYER_BALANCE`. The portal UI + optional webhook warn you as soon as 20% balance remains.

### Where are the audits?

Full reports from Trail of Bits and Octane will be published on xmtp.org before paid messaging is enforced.

### Are grants available?

Yes—apply via the XMTP Dev Grants program. Approved wallets receive periodic top-ups visible in your payer balance dashboard.

### What determines the effective price per message?

Messaging fees are charged per byte, with total cost scaling linearly with bytes sent. The effective per-message rate shown in the estimator assumes a 1,024-byte message and includes all components: base fees for message storage, gas fees for metadata written to XMTP’s L3, and a 5% protocol treasury share.

### Is price global or per-sender?

The protocol charges a single global per-byte rate that falls as total network volume rises. All developers benefit from lower per-byte rates as the network grows.

### What counts as a “message”?

All XMTP message types are subject to per-byte fees—including invisible system messages like consent updates, group-state sync, identity associations, and more. Additionally, critical group state updates and identity changes incur small gas fees on XMTP’s L3.

### Are attachments or large media extra?

No. They’re just larger messages. XMTP charges per byte, so sending media costs more only due to size—capped at 1 MB per message. For lower costs and larger files, use remote attachment messages to point to off-network storage like IPFS or S3.

### Is the current fee level sustainable for node operators?

Yes. The network is designed to be profitable at 1B messages/month. As volume grows beyond this point, surplus revenue is recycled to lower the global per-byte price for everyone.

### How are costs estimated for 100M or even 1B users?

At very high volumes, price converges to a global floor that ensures node operators remain sustainable. The current effective floor price is $3 per 100,000 messages. Future node efficiency improvements are expected to push this floor even lower.

### Do fees ever increase?

The system is designed for fees to decrease over time as volume grows and nodes become more efficient. However, if network volume drops significantly, the global per-byte price can rise to maintain sustainability. Congestion surcharges may occur briefly on overloaded nodes, but traffic can route through another node at the standard price.

### Can I let sponsors or end-users cover my costs?

Yes. Any wallet can deposit USDC into your balance. Once deposited, funds are only withdrawable by your app.

### Where can I see a detailed fee breakdown?

All pricing is onchain and fully auditable. The payer portal shows per-byte fees, gas costs, and your historical and projected spend.

### How do I fund usage and avoid interruptions?

Fees are drawn from an onchain USDC balance that you can [fund and manage through the XMTP payer portal](https://www.notion.so/Protocol-Release-1-3-1ff30823ce9280f1b2fdff148fad85dd?pvs=21). The portal will support balance notifications and auto top-ups.

## Do I need Go developers?

Only if you're NOT using Node.js. Node.js has the payer built-in. For all other platforms, you'll need either the Docker image (no Go required) or Go developers for customization.

## How accurate is the $5 per 100K messages estimate?

This estimate assumes typical usage patterns (1KB messages, 1-2 group operations per 100 messages). Most apps fall within 10% of this estimate.

## What if my XMTP Gateway goes down?

Messages will queue until your payer is back online. Build redundancy if needed. (Node.js apps have payer built-in, reducing this risk.)

## Can someone else pay for my app's messaging?

Yes! Anyone (investors, sponsors, partners) can deposit funds to your wallet through the Funding Portal. You can also manage funds for other developers.

## How much does infrastructure cost?

Node.js apps: No additional infrastructure needed. Other apps: $25-50/month for hosting plus RPC provider costs.

## Glossary

### Balance

Balance available to pay for messaging fees. This includes:

- The USDC balance held in the PayerRegistry contract for your payer wallet
- The USDC balance in your payer wallet on the XMTP Appchain

### Base

An Ethereum L2 network developed by Coinbase on the OP Stack. Base processes transactions offchain and settles them on Ethereum.

### Congestion fee

A dynamic offchain fee added during high network activity to manage load, determined by and paid to node operators.

### Message fee

A fixed offchain micropayment paid to node operators for delivering a message.

To learn more, see [Understand XMTP messaging fees](https://file+.vscode-resource.vscode-cdn.net/docs/fund-your-app/fees).

### Payer

A payer is typically an app or agent that pays to use the XMTP network to send messages.

### PayerRegistry

A smart contract that holds and manages balances for registered payer wallets. The PayerRegistry enables:

- Pay-as-you-go messaging funding
    - A payer registers their payer wallet in the PayerRegistry. The payer deposits USDC into the PayerRegistry for their payer wallet to compensate node operators.
    - Funds are used to pay node operators for message delivery, storage, and any applicable congestion fees
- Balance management
    - Deposits: Any wallet can deposit USDC into the PayerRegistry for a registered payer wallet
    - Withdrawals: The PayerRegistry maintains balances and pending withdrawals. Only a payer wallet can request and finalize withdrawals.
        1. Payer wallet requests withdrawal from the PayerRegistry.
        2. After a waiting period, the payer wallet can cancel or finalize the withdrawal from the PayerRegistry.
        3. If finalized, the withdrawal is made from the PayerRegistry to the payer wallet.
- Fee settlement
    - The PayerRegistry handles paying node operators
    - It tracks usage and deducts fees from payer wallet balances
    - It enforces sufficient balance requirements for message sending

To learn more, see [PayerRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/PayerRegistry.sol#L38) in the XMTP smart-contracts repo.

### Payer wallet

A non-custodial Ethereum-compatible wallet address used to track for your app's messaging fees. The payer wallet is registered in the PayerRegistry and is the only wallet that can request withdrawals and control its funds in the PayerRegistry. However, any wallet can contribute funds to the PayerRegistry for the payer wallet.

### Payer service

A small client that acts as a proxy between your app and the payer wallet, and more specifically, the payer wallet's private key. Here's what the payer service handles:

- Security: The payer wallet's private key is sensitive information that shouldn't be in your app
    - The payer service hosts this private key securely on your infrastructure
    - Your app never sees or handles the private key directly
- Authorization: The payer service can implement your app's authorization logic
    - It can verify that requests are coming from your legitimate users
    - It can rate limit requests
    - It can enforce your app's business rules
- Fee management: The payer service handles both types of fees:
    - Signs transactions on Base for paying messaging fees from the PayerRegistry contract
    - Signs transactions on the XMTP Appchain for paying gas fees from the payer wallet (Payers contract)

### Storage fee

An offchain micropayment paid to node operators based on the size (in bytes) of a stored message.

### Subgraph

A real-time index that tracks PayerRegistry contract activity—such as who funded a payer wallet, how much was spent, and which messages incurred fees—enabling the XMTP Payer Portal to display historical and live fee data.

### Target rate/min

The desired maximum number of messages the network aims to handle per minute to maintain performance and prevent overload.

### XMTP Appchain

An L3 blockchain built as an Arbitrum Orbit rollup that settles onto Base. It manages metadata requiring strict ordering through these smart contracts:

- [`identity_update.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/identity_update.go): Tracks wallet addresses associated with each XMTP inbox
- [`group_message.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/group_message.go): Manages group membership changes with guaranteed ordering

### NodeRegistry

A smart contract on Base that manages the list of authorized XMTP broadcast network nodes.

To learn more, see [NodeRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/NodeRegistry.sol) in the smart-contracts repo.

### XMTP Appchain block time

250 milliseconds, which is the average time it takes for a new block to be added to the XMTP Appchain.

### XMTP Appchain gas fee

A fee for an onchain transaction on the XMTP AppChain, typically for group membership, identity, and payer-related updates. Fees are expressed in Gwei and paid with USDC directly held by payer wallets on the XMTP Appchain.

### XMTP Appchain latest block

The most recent block that has been produced and confirmed on the XMTP Appchain.

### XMTP Appchain transactions per second

The number of transactions the XMTP Appchain can process every second, reflecting network throughput.