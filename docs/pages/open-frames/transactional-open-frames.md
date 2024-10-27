# Display a transactional Open Frame

A transactional Open Frame enables users to trigger onchain transactions. To learn how to build a transaction Open Frame, see [Transactions](https://messagekit.ephemerahq.com/frames/tutorials/transactions).

This tutorial assumes your app already supports non-transactional Open Frames. If not, see [Get started with Open Frames](/open-frames/open-frames) to set this up first.

:::tip

A minting Open Frame is a type of transactional Open Frame. Where applicable, we'll provide details specific to displaying minting Open Frames.

:::

## Example transactional Open Frame

Use this example [transactional Open Frame](https://tx-boilerplate-frame.vercel.app/) with this tutorial to try out the steps in your app. This example uses the Sepolia network to make a 0.0000032ETH (~1 cent) transaction to the address associated with `hi.xmtp.eth`, or `0x194c31cAe1418D5256E8c58e0d08Aee1046C6Ed0`.

You can explore this Open Frame's code in the [tx-boilerplate-frame](https://github.com/xmtp-labs/tx-boilerplate-frame) repo.

## Security considerations for transactional Open Frames

When displaying transactional Open Frames in your app, consider following these security best practices to keep your users safe:

- Include allowlists that enable your app to interact with known “safe” transactional Open Frames only
- For unknown Open Frames, inform the user that they are about to interact with an unknown Open Frame and provide the choice to cancel or proceed at their own risk.
- Use simulation services if you want to allow access to unverified transactional Open Frames. These services enable you to submit transaction information to a simulator first. This lets users preview the transaction process and debit amount details without financial risk.

For more transactional Open Frame security considerations, see [Frame Transactions: Security Consideration](https://www.notion.so/warpcast/Frame-Transactions-Public-9d9f9f4f527249519a41bd8d16165f73?pvs=4#03962a8da2574f9ea6ce093359f8235a).

## Identify a transactional Open Frame

Open Frame transactions are triggered using button-click events. Therefore, the best way to determine if an Open Frame is transactional is to look for a button `action` set to `tx` in the Open Frame metadata. For example:

```tsx [TypeScript]
import { OpenFramesProxy } from "@xmtp/frames-client";

const proxy = new OpenFramesProxy();
const frameMetadata = proxy.readMetadata("url_of_frame");

// Get correct button index from click handler
const button = frameMetadata.frameInfo.buttons[`${buttonIndex}`];

const isTransactionFrame = button.action === "tx";
```

## Identify the transaction target and postUrl

If the button action indicates the Open Frame is transactional, get the `target` and `postUrl` from the button. To learn more, see [Open Frame Metadata - Optional Properties](https://www.openframes.xyz/#optional-properties).

```tsx [TypeScript]
if (isTransactionFrame) {
  const { target, postUrl } = button;

  // Rest of logic in this guide
}
```

## Post to the target URL to fetch transaction data

Make a POST request to the `target` URL to fetch transaction data. Make this request from the Open Frame with a signed Open Frame action payload in the POST body. In the `address` field, include the address of the connected wallet.

```tsx [TypeScript]
import { FramesClient } from "@xmtp/frames-client";

const framesClient = new FramesClient(client);

const payload = await framesClient.signFrameAction({
  // Same payload as for other frames, + an address field
  // Address should be the 0x address of the connected account
  address,
});

const transactionInfo: {
  chainId: string;
  method: "eth_sendTransaction";
  params: {
    abi: Abi | [];
    to: `0x${string}`;
    value?: string;
    // Needed if you are interacting with a smart contract in this transaction, e.g. in a mint scenario
    data?: `0x${string}`;
  };
} = await framesClient.proxy.postTransaction(target, payload);
```

## Process transaction data and receive a hash

Pull the address and value from the returned transaction data and use them to process the transaction using your preferred tools, such as Infura. Documenting this step in detail is out of the scope of this tutorial.

```tsx [TypeScript]
const address = transactionInfo.params.to;
// Returned as wei in a string
const value = Number(transactionInfo.params.value);


// Pass the address, value, and any other information needed
// Process the payment via your preferred tools and receive a hash.
const transactionHash = <<returned_hash>>
```

## Ensure the processed transaction matches the request

Use the hash to gather information about the processed transaction using your preferred tools. Ensure that the details match the requested transaction.

```tsx [TypeScript]
// Pass the hash to your provider of choice
// Receive the processed transaction details
const transactionReceipt = <<returned_details_from_hash>>

if (
    transactionReceipt.to !== address || transactionReceipt.value !== value
  ) {
    // Error handle, shouldn't show frame success screen
  } else {
    // Pass the hash as an optional transactionId to the signFrameAction payload if you plan to use it
    // Complete the transaction, which returns metadata of a new success frame
    const completeTransaction = await framesClient.proxy.post(
      postUrl,
      payload,
    );
    // Set the current frame state to this new metadata/success screen
  }
}
```
