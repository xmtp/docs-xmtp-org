# Fund your app to send messages with XMTP

Use this guide to learn how to use the XMTP Funding Portal to fund your app to send messages with XMTP. You can also use the portal to view usage and current and projected fees.

Behind the scenes, the Funding Portal handles PayerRegistry smart contract deposits, XMTP Network messaging fee and XMTP Appchain gas payments, and all blockchain interactions.

[Ephemera](https://ephemerahq.com/) currently hosts the XMTP Funding Portal UI as a community service. Stewardship will move to DUNA post-GA. The [smart contracts](https://github.com/xmtp/smart-contracts) used by the portal are fully decentralized and non-custodial.

## Step 1. Create your payer wallet

A payer wallet is what you'll use to fund your XMTP Gateway Service. 

The payer wallet must be:

- A standard Ethereum-compatible wallet account
- Non-custodial, meaning you control the private key (not a third-party service)
- Able to sign and transact on the Base and XMTP Appchain networks
- Able to hold and transfer USDC tokens

You can create a payer wallet using common non-custodial wallet apps, such as Coinbase Wallet and MetaMask.

If useful for shared budgets, you can use a multisig wallet. For example, a Gnosis Safe or any ERC-1271 wallet can own a balance in the PayerRegistry and sign allowance approvals.

You'll register your payer wallet using the XMTP Funding Portal in the next step.

You'll need your payer wallet's private key when setting up your XMTP Gateway Service in a subsequent step.

## Step 2: Fund your payer wallet with USDC on Base

Fund your payer wallet with USDC on Base. Here are some sources you can use to acquire USDC:

- Centralized exchanges: Binance, Coinbase, Kraken
- Direct purchase: Circle, Coinbase
- Business accounts: Circle business accounts for larger operations

To get USDC on Base Sepolia, you can use [https://faucet.circle.com/](https://faucet.circle.com/), which provides 10 USDC per hour. 

## Step 3. Set up your first payer

1. Use your payer wallet to connect to the XMTP Funding Portal: [https://fund.xmtp.org/](http://fund.xmtp.org/).
2. On the Welcome page, click **Use connected wallet**.
3. Open the **View as** menu and click **Manage payers**.
4. Click the pencil icon to give your payer a human-readable name.

Your payer wallet is now a payer in the PayerRegistry smart contract. 

In the next step, you'll fund your payer with USDC that the Funding Portal can use to pay XMTP Network messaging fees and XMTP Appchain gas fees.

## Step 4: Fund your payer

The XMTP Funding Portal will accept only testnet USDC until **October 7, 2025**. Plan your testnet and mainnet funding accordingly.

1. Connect your payer wallet to the XMTP Funding Portal: [https://fund.xmtp.org/](http://fund.xmtp.org/).
2. On the Home page, click **Fund**.
3. Enter the amount of USDC you want to fund your payer with.
4. The XMTP Funding Portal automatically optimizes how the funds are deposited to cover messaging fees and gas fees. Click the **+** icon to view the details of the split.
5. Click **Continue**.
6. The Depositing funds screen displays. You can click **Cancel transaction** to attempt to cancel the transaction, if needed.

Your payer now has a USDC allowance the Funding Portal can use to pay XMTP Network messaging fees and XMTP Appchain gas fees.

Once the payer wallet is set up as a payer, you can use the payer wallet (and only the payer wallet) to [receive withdrawals](#step-6-withdraw-funds) of funds allocated to the payer in the Payer Registry smart contact.

## Step 5: Review usage

You can use the Usage panel on the home page of the XMTP Funding Portal to review the number of messages sent by your app, as well as actual and projected fees.

Before data can display in the Usage panel, you must have completed the following on the appropriate network (testnet or mainnet):

1. [Deployed your XMTP Gateway Service](/fund-apps/run-gateway)
2. Updated your app to [use a compatible XMTP SDK](/fund-apps/update-sdk)
3. Sent messages using your app

## Step 6: Withdraw funds

You can withdraw funds from your payer at any time. Funds will be available after 48 hours, and require a second transaction to claim.

1. Connect your payer wallet to the XMTP Funding Portal: [https://fund.xmtp.org/](http://fund.xmtp.org/).
2. On the Home page, click **Withdraw**.
3. Enter the amount of USDC you want to withdraw from your payer. Click **MAX** if you want to withdraw the maximum amount available in your payer.
4. Click **Request withdrawal**.
5. XXXX Need to wait to see this part of the UI XXXXX.
6. After 48 hours, return to the XMTP Funding Portal to complete your withdrawal. On the homepage, view the **Transaction** panel and locate your **Withdrawal** transaction. The **Status** column should be set to **_Ready to withdraw_**.
7. Click **Ready to withdraw** to display the **Transaction details** panel.
8. Verify the withdrawal details and click **Claim USDC**.
9. XXXX Need to wait to see this part of the UI XXXXX.

## Troubleshooting

### Signature rejected (MetaMask only)

If you see a **Signature rejected** error in MetaMask, it can sometimes be caused by a stuck or out-of-sync **nonce** (a number that keeps track of your transaction order).
    
To fix this:
    
1. Open MetaMask.
2. Click your **account icon** in the top right.
3. Go to **Settings → Advanced**.
4. Click **Reset Account**. This does not affect your funds or wallet.
    
If the issue persists:
    
- Check for any stuck or pending transactions in your wallet.
- Try sending a new transaction with a **custom nonce** if needed.

### Bridge pending > 15 min

Check Base status: [https://status.base.org/](https://status.base.org/).

### Message reverted

Check for `INSUFFICIENT_PAYER_BALANCE`.

### Region restrictions

Nodes in the XMTP testnet and mainnet that operate in US jurisdiction do so in compliance with Office of Foreign Assets Control (OFAC) sanctions and Committee on Foreign Investment in the United States (CFIUS) export compliance regulations. Accordingly, for these nodes, IP-based geoblocking is in place for the following countries/territories:

- Cuba
- Iran
- North Korea
- Syria
- The Crimea, Donetsk People’s Republic, and Luhansk People’s Republic regions of Ukraine
