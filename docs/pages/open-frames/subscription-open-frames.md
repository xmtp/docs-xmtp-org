# Display a subscription Open Frame

A subscription Open Frame enables users to subscribe to content. To learn how to build a subscription Open Frame, see [Subscribe](https://message-kit.vercel.app/frames/tutorials/subscribe).

This tutorial assumes your app already supports non-subscription Open Frames. If not, see [Get started with Open Frames](/open-frames/open-frames) to set this up first.

## Example subscription Open Frame

Use this example [subscription Open Frame](https://subscribe-boilerplate-frame.vercel.app/) with this tutorial to try out the steps in your app. 

This example Open Frame uses a randomly generated wallet on the XMTP `dev` network to automatically send a "Thank you for subscribing!" message to your main inbox upon subscribing.

You can explore this Open Frame's code in the [subscribe-boilerplate-frame](https://github.com/xmtp-labs/subscribe-boilerplate-frame).

## Identify a subscription Open Frame

Subscriptions via an Open Frame are triggered using button-click events. Subscription Open Frames are a type of transactional Open Frame. Therefore, the best way to identify that an Open Frame supports subscription transactions is to look for a button `action` set to `tx` in the Open Frame metadata. For example:

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

Make a POST request to the `target` URL to fetch transaction data. The payload that gets returned will return an `eth_personalSign` method if in the subscribe flow, and this is how you know you're dealing with a subscription Open Frame.

Make this request from the Open Frame with a signed Frame action payload in the POST body. In the `address` field, include the address of the connected wallet.

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
	method: 'eth_personalSign';
	params: {
		abi: [];
		to: `0x${string}`;
		value?: string; // In the case of a subscribe frame, this will be the message that the user will consent to
	};
} = await framesClient.proxy.postTransaction(
        target,
        payload,
      );
```

## Process transaction data and receive a signature

Pull the consent message from the value of the returned transaction data and use this to get a signature using your preferred tools, such as Viem. Documenting this step in detail is out of the scope of this tutorial.

```tsx [TypeScript]
const value = transactionInfo.params.value;

// Pass the value and account to your preferred tools and receive a signature
const signature = <<returned_signature>>
```

## Pass this signature to the signFrameAction

Prepare a new payload with the signature passed as `transactionId` to pass to the final step.

```tsx [TypeScript]
const payload = await framesClient.signFrameAction({
  ...prevPayload,
  transactionId: signature,
});
```

## Complete the subscription and display a success screen

To complete the subscription flow and return metadata for a new success Frame, pass the `postUrl` from the button and the payload with the signature from the previous step.

```tsx [TypeScript]
const completeTransaction = await framesClient.proxy.post(
  buttonPostUrl,
  payloadWithTxId,
);
// Finally, set the current frame state to this new metadata/success screen
```
