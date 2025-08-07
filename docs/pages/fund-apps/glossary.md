# Glossary

###I think we can write these and some can be used as tooltips in the UI###

## Balance

The total amount of USDC available to pay for messaging fees. This includes:

- The USDC allocated to your **messaging balance** in the PayerRegistry smart contract.
- The spendable USDC balance in your payer wallet on the XMTP Appchain.

## Base

An Ethereum L2 network developed by Coinbase on the OP Stack. Base processes transactions offchain and settles them on Ethereum.

## Congestion fee

A dynamic offchain fee added during high network activity to manage load, determined by and paid to node operators.

### Message fee

A fixed offchain micropayment paid to node operators for delivering a message.

To learn more, see [Understand XMTP messaging fees](https://file+.vscode-resource.vscode-cdn.net/docs/fund-your-app/fees).

### Payer

A payer is typically an app or agent that pays to use the XMTP Broadcast Network to send messages.

### PayerRegistry

A smart contract that holds and manages messaging balances for registered payer wallets. The PayerRegistry enables:

- **Pay-as-you-go messaging**: A developer registers their payer wallet and allocates USDC to it, creating a messaging balance to compensate node operators.
- **Balance management**: Any wallet can deposit USDC to a registered payer wallet's messaging balance. Only the registered payer wallet can withdraw (deallocate) funds from its balance.
- **Fee settlement**: The PayerRegistry tracks usage, deducts fees from messaging balances, and enforces sufficient balance requirements for sending messages.

To learn more, see [PayerRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/PayerRegistry.sol#L38) in the XMTP smart-contracts repo.

### Payer wallet

A non-custodial, Ethereum-compatible wallet that you register and use to allocate USDC to pay for your app's messaging fees.

The payer wallet is the only wallet that can control its messaging balance in the PayerRegistry, but any wallet can allocate funds to its messaging balance.

### XMTP Gateway Service

A small client that acts as a proxy between your app and the payer wallet, and more specifically, the payer wallet's private key. Here's what the XMTP Gateway Service handles:

- Security: The payer wallet's private key is sensitive information that shouldn't be in your app
    - The XMTP Gateway Service hosts this private key securely on your infrastructure
    - Your app never sees or handles the private key directly
- Authorization: The XMTP Gateway Service can implement your app's authorization logic
    - It can verify that requests are coming from your legitimate users
    - It can rate limit requests
    - It can enforce your app's business rules
- Fee management: The XMTP Gateway Service handles both types of fees:
    - Signs transactions on Base for paying messaging fees from the PayerRegistry contract
    - Signs transactions on the XMTP Appchain for paying gas fees from the payer wallet (Payers contract)

### Storage fee

An offchain micropayment paid to node operators based on the size (in bytes) of a stored message.

### Subgraph

A real-time index that tracks PayerRegistry contract activity—such as who funded a messaging balance, how much was spent, and which messages incurred fees—enabling the XMTP Funding Portal to display historical and live fee data.

### Target rate/min

The desired maximum number of messages the network aims to handle per minute to maintain performance and prevent overload.

### XMTP Broadcast Network

The offchain, globally distributed network of nodes responsible for securely routing and delivering encrypted messages between users. Messaging fees support the operators of these nodes.

### XMTP Appchain

An L3 blockchain built as an Arbitrum Orbit rollup that settles onto Base. It manages metadata requiring strict ordering through these smart contracts:

- [`identity_update.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/identity_update.go): Tracks wallet addresses associated with each XMTP inbox
- [`group_message.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/group_message.go): Manages group membership changes with guaranteed ordering

### NodeRegistry

A smart contract on Base that manages the list of authorized XMTP Broadcast Network nodes.

To learn more, see [NodeRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/NodeRegistry.sol) in the smart-contracts repo.

### XMTP Appchain block time

250 milliseconds, which is the average time it takes for a new block to be added to the XMTP Appchain.

### XMTP Appchain gas fee

A fee for an onchain transaction on the XMTP Appchain, typically for group membership, identity, and payer-related updates. Fees are expressed in Gwei and paid with USDC directly held by payer wallets on the XMTP Appchain.

### XMTP Appchain latest block

The most recent block that has been produced and confirmed on the XMTP Appchain.

### XMTP Appchain transactions per second

The number of transactions the XMTP Appchain can process every second, reflecting network throughput.
