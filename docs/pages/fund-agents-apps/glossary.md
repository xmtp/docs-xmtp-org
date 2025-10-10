# Glossary for funding your app to send messages with XMTP

## Allowance

Total amount of USDC allocated to pay for messaging and gas fees for a registered payer wallet. This includes:

- USDC allocated to your registered payer wallet in the Payer Registry smart contract. This allowance will be used to pay XMTP Broadcast Network messaging fees.
- USDC in your payer wallet on the XMTP App Chain. This balance will be used to pay XMTP App Chain gas fees.

To learn more, see [Fund an app to send messages with XMTP](/fund-agents-apps/fund-your-app).

## Base

An Ethereum L2 network developed by Coinbase on the OP Stack. Base processes transactions offchain and settles them on Ethereum.

## Congestion fee

A dynamic offchain fee added during high network activity to manage load, determined by and paid to node operators.

To learn more, see [Understand and calculate XMTP fees](/fund-agents-apps/calculate-fees).

## Message fee

A fixed offchain micropayment paid to node operators for delivering a message.

To learn more, see [Understand and calculate XMTP fees](/fund-agents-apps/calculate-fees).

## Node Registry

A smart contract on Base that manages the list of authorized XMTP Broadcast Network nodes.

To learn more, see [NodeRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/NodeRegistry.sol) in the smart-contracts repo.

## Payer

A payer is typically an app or agent that pays to use the XMTP Broadcast Network to send messages.

## Payer Registry

A smart contract that holds and manages messaging balances for registered payer wallets. The Payer Registry enables:

- **Pay-as-you-go messaging**: A developer registers their payer wallet and allocates USDC to it, creating a messaging balance to compensate node operators.
- **Balance management**: Any wallet can deposit USDC to a registered payer wallet's messaging balance. Only the registered payer wallet can withdraw funds from its balance.
- **Fee settlement**: The Payer Registry tracks usage, deducts fees from messaging balances, and enforces sufficient balance requirements for sending messages.

To learn more, see [PayerRegistry.sol](https://github.com/xmtp/smart-contracts/blob/6ff95e20acdcfdbf932cb3254ad132daeb3e59e4/src/settlement-chain/PayerRegistry.sol#L38) in the XMTP smart-contracts repo.

## Payer wallet

A non-custodial, Ethereum-compatible wallet that you register and use to allocate USDC to pay for your app's messaging fees.

The payer wallet is the only wallet that can control its messaging balance in the Payer Registry, but any wallet can allocate funds to its messaging balance.

To learn more, see [Fund an app to send messages with XMTP](/fund-agents-apps/fund-your-app).

## Storage fee

An offchain micropayment paid to node operators based on the size (in bytes) of a stored message.

## Subgraph

A real-time index that tracks PayerRegistry contract activity—such as who funded a messaging balance, how much was spent, and which messages incurred fees—enabling the XMTP Funding Portal to display historical and live fee data.

## XMTP App Chain

An L3 blockchain built as an Arbitrum Orbit rollup that settles onto Base. It manages metadata requiring strict ordering through these smart contracts:

- [`identity_update.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/identity_update.go): Tracks wallet addresses associated with each XMTP inbox
- [`group_message.go`](https://github.com/xmtp/xmtpd/blob/522d05f5a5d0499157635aba98c3f5b2556470d4/pkg/indexer/app_chain/contracts/group_message.go): Manages group membership changes with guaranteed ordering

Gas fees are charged for onchain transactions on the XMTP App Chain. These transactions are typically for group membership, identity, and payer-related updates. Fees are paid with USDC directly held by payer wallets on the XMTP App Chain.

When you [fund your payer wallet](/fund-agents-apps/fund-your-app) using the XMTP Funding Portal, it automatically bridges an optimized percentage of the USDC funds to the XMTP App Chain to cover gas fees.

## XMTP Broadcast Network

The offchain globally distributed network of nodes responsible for securely routing and delivering encrypted messages between users. Messaging fees support the operators of these nodes.

## XMTP Gateway Service

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
  - Signs transactions on the XMTP App Chain for paying gas fees from the payer wallet (Payers contract)

To learn more, see [Run an XMTP Gateway Service](/fund-agents-apps/run-gateway).

## XMTP Settlement Chain

An L3 blockchain built on Base that manages the decentralized network of nodes and payers and facilitates the settlement of fees between them. The core functionality revolves around registering nodes, submitting and settling fees for offchain network usage by payers, and distributing the collected revenue to the node operators and the protocol.

To learn more, see the [README](https://github.com/xmtp/smart-contracts/blob/main/src/settlement-chain/README.md) for the XMTP Settlement Chain smart contracts.
