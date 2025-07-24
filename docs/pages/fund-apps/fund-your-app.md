# Fund your app to send messages with XMTP

Use this guide to learn how to use the XMTP Funding Portal to fund your app to send messages with XMTP.

The Funding Portal simplifies blockchain complexity:

1. You create a payer wallet and fund it with **USDC** (USD Coin), a stable cryptocurrency pegged to the US dollar, on the Base network.
2. You use your payer wallet to set up a payer in the Funding Portal.
3. You fund your payer with **USDC** (USD Coin), a stable cryptocurrency pegged to the US dollar.
4. The Funding Portal handles all fee payments using the USDC in your payer funds.
5. You can use the Funding Portal to monitor the number of messages sent and amount of USDC consumed. Use the information to manage your USDC balance to ensure continuous service.

Behind the scenes, the Funding Portal handles PayerRegistry smart contract deposits, XMTP network messaging fee and XMTP Appchain gas payments, and all blockchain interactions.

[Ephemera](https://ephemerahq.com/) currently hosts the XMTP Funding Portal UI as a community service. Stewardship will move to DUNA post-GA. The [smart contracts](#TODO) used by the portal are fully decentralized and non-custodial.

## Step 1. Create your payer wallet

A payer wallet is what you'll use to fund your XMTP Gateway. 

The payer wallet must be:

- A standard Ethereum-compatible wallet account
- Non-custodial, meaning you control the private key (not a third-party service)
- Able to sign and transact on the Base and XMTP Appchain networks
- Able to hold and transfer USDC tokens

You can create a payer wallet using common non-custodial wallet apps, such as Coinbase Wallet and MetaMask.

If useful for shared budgets, you can use a multisig wallet. For example, a Gnosis Safe or any ERC-1271 wallet can own a balance in the PayerRegistry and sign allowance approvals.

You'll register your payer wallet using the XMTP Funding Portal in the next step.

You'll need your payer wallet's private key when setting up your XMTP Gateway in a subsequent step.

## Step 2: Fund your payer wallet with USDC on Base

Be sure your payer wallet has USDC on Base. Here are some sources you can use to acquire USDC:

- Centralized exchanges: Binance, Coinbase, Kraken
- Direct purchase: Circle, Coinbase
- Business accounts: Circle business accounts for larger operations

## Step 3. Set up your first payer

1. Use your payer wallet to connect to the XMTP Funding Portal: [https://fund.xmtp.org/](http://fund.xmtp.org/).
2. On the Welcome page, click **Use connected wallet**.
3. Open the **View as** menu and click **Manage payers**.
4. Click the pencil icon to give your payer a human-readable name.

Your payer wallet is now a payer in the PayerRegistry smart contract. 

In the next step, you'll fund your payer with USDC that the Funding Portal can use to pay XMTP network messaging fees and XMTP Appchain gas fees.

## Step 4: Fund your payer

The XMTP Funding Portal will accept only testnet USDC until **October 7, 2025**. Plan your testnet and mainnet funding accordingly.

- **July-September**: Test with testnet USDC only
- **October 7+**: Funding Portal accepts mainnet USDC deposits
- **November**: Fund wallet for production testing on mainnet
- **Early December**: Ensure 3-6 months of operating funds on mainnet

1. Connect your payer wallet to the XMTP Funding Portal: [https://fund.xmtp.org/](http://fund.xmtp.org/).
2. On the Home page, click **Fund**.
3. Enter the amount of USDC you want to fund your payer with.
4. The XMTP Funding Portal automatically optimizes how the funds are deposited to cover messaging fees and gas fees. Click the **+** icon to view the details of the split.
5. Click **Continue**. XXXXXXX

Your payer now has a USDC allowance the Funding Portal can use to pay XMTP Network messaging fees and XMTP Appchain gas fees.

Once the payer wallet is set up as a payer, you can use the payer wallet to receive withdrawals of funds allocated to the payer in the Payer Registry smart contact.

You can switch payer wallets at any time. Disconnect the old payer wallet and connect a new one; your payer allowances stay onchain and can be managed by any wallet you control.

### Flexible funding options

The Funding Portal allows any wallet to deposit USDC to any payer as long as it passes standard ERC-20 transfer rules. Whether you're funding yourself, being funded by others, or managing funds for a portfolio, the process is the same: Deposit USDC to the target payer through the Funding Portal.

The Funding Portal supports various funding scenarios:

- **Direct funding**: Fund your own apps directly
- **Third-party funding**: Anyone can deposit funds on your behalf
  - Investors can fund your startup's messaging costs
  - Sponsors can cover costs for open source projects
  - Parent companies can fund subsidiary apps
- **Managing others' funds**: You can also manage funds for other developers
  - Fund multiple projects from one account
  - Distribute investor funds to portfolio companies
  - Manage messaging budgets across teams

## Step 6. Send a test message and verify

Send a test message and view the XXXXXXXXXX dashboard in the XMTP Funding Portal to verify costs.


## Step 4: Test Your Integration

### Testing Timeline

**July 29 - October 6**: Testnet-only period

- Use testnet USDC (no real costs)
- Validate XMTP Gateway setup
- Test authentication flows
- Ensure infrastructure scales

**October 7+**: Full mainnet testing

- Funding Portal accepts real USDC
- Production environment testing
- Cost validation with real funds
- Final integration checks

### Testing Priorities

- [ ]  Deploy and test XMTP Gateway (unless using Node.js)
- [ ]  Verify authentication works properly
- [ ]  Test with expected message volumes
- [ ]  Monitor resource usage and costs
- [ ]  Simulate failure scenarios

### Is there a testnet?

Yes—Base Sepolia, AppChain TestNet, and Broadcast Network TestNet all run identical contracts so you can dry-run funding and messaging.

### How do I get testnet funds?

Use the USDC faucet linked in the docs or DM @DevRel in Discord for bulk credits.

## Troubleshooting

- Signature rejected (MetaMask only) → If you see a **“Signature rejected”** error in MetaMask, it can sometimes be caused by a stuck or out-of-sync **nonce** (a number that keeps track of your transaction order).
    
    To fix this:
    
    1. Open MetaMask.
    2. Click your **account icon** in the top right.
    3. Go to **Settings → Advanced**.
    4. Click **Reset Account**. This does not affect your funds or wallet.
    
    If the issue persists:
    
    - Check for any stuck or pending transactions in your wallet.
    - Try sending a new transaction with a **custom nonce** if needed.
- Bridge pending > 15 min → Check Base status: [https://status.base.org/](https://status.base.org/)
- Message reverted: Check for `INSUFFICIENT_PAYER_BALANCE`
- Region restrictions: Automatic IP gate enforced for the following regions:
    
    Nodes in the `dev` and `production` XMTP network environments operate in US jurisdiction in compliance with Office of Foreign Assets Control (OFAC) sanctions and Committee on Foreign Investment in the United States (CFIUS) export compliance regulations. Accordingly, IP-based geoblocking is in place for the following countries/territories:
    
    - Cuba
    - Iran
    - North Korea
    - Syria
    - The Crimea, Donetsk People’s Republic, and Luhansk People’s Republic regions of Ukraine
