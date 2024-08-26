# Broadcast messages with XMTP

Broadcasting with XMTP allows you to send a single message to multiple recipients, treating each message as a direct message (DM) from the sender's wallet address to each recipient's wallet address. This method is particularly useful for announcements or updates. However, it's important to note that each recipient wallet must be activated on the XMTP network to receive messages.

## Prerequisites

- Wallet is XMTP-enabled  
Before sending a broadcast message, [use `canMessage`](/get-started/developer-quickstart#check-if-the-recipient-address-is-xmtp-enabled) to verify that each recipient's wallet is enabled on the XMTP network. Only XMTP-enabled wallets can receive and view messages.
- User consent  
In accordance with data privacy laws, [obtain explicit consent](/consent/user-consent) from users before sending them broadcast messages.

:::warning
Broadcast messages delivered to users who haven't provided explicit consent to receive them are more likely to be treated as spam, which significantly reduces the chances that recipients will see them.
:::

## Use broadcast tools

- Use the [Broadcast SDK](https://www.npmjs.com/package/@xmtp/broadcast-sdk) to send high-volume broadcasts. The SDK helps manage [rate-limiting logic](#understand-xmtp-network-rate-limits) and enables easier broadcasting setup.

- Explore the [broadcaster-app](https://github.com/alexrisch/broadcaster-app) repo for concise strategies and code samples for high-volume broadcast management, including batch processing, error handling, and rate-limit adherence.

## Send a broadcast message

Here's a simplified example for sending a broadcast message with XMTP.

```jsx [JavaScript]
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";

// Function to send a broadcast message to a list of recipients
async function sendBroadcastMessage(recipients, message) {
  // In a real application, use the user's wallet
  const signer = ethers.Wallet.createRandom();
  const xmtp = await Client.create(signer);

  // Iterate over each recipient to send the message
  for (const recipient of recipients) {
    // Check if the recipient is activated on the XMTP network
    if (await xmtp.canMessage(recipient)) {
      const conversation = await xmtp.conversations.newConversation(recipient);
      await conversation.send(message);
      console.log(`Message successfully sent to ${recipient}`);
    } else {
      console.log(
        `Recipient ${recipient} is not activated on the XMTP network.`,
      );
    }
  }
}

// Example usage
const recipients = ["0x123...", "0x456..."]; // Replace with actual recipient addresses
const message = "Hello from XMTP!"; // Your broadcast message
sendBroadcastMessage(recipients, message);
```

## Understand XMTP network rate limits

Currently, XMTP network nodes are configured to rate-limit high-volume publishing from clients.

Ephemera is capable of rate-limiting the network while we are the only node operators. Rate-limiting is a consideration in our research into economic spam controls. Ultimately, rate-limiting decisions will be made based on maintaining network quality and reducing the potential for malicious attacks by senders and nodes.

When planning to send broadcast messages at a high volume, it's crucial to consider these rate limits to ensure efficient and responsible network use. High-volume broadcasts require a careful strategy to avoid rate-limiting issues and to maintain network health.

### What are the rate limits?

- 1,000 publish requests per 5 minutes
- 10,000 general requests per 5 minutes
- Nodes allow 40,000 reads per 5 minutes

Sending a message to an existing conversation counts as 1 publish request API call.

Sending a message to create a new conversation counts as 2 publish request API calls.

If your requirements exceed these limits, [submit this form](https://docs.google.com/forms/d/e/1FAIpQLSftr558wsYD2X_0c1Jsz6rTxua1f1DDJidAn7iphJVc48l7Fw/viewform) to share more details with the Ephemera team.

### What happens if I exceed the rate limits?

You'll get an HTTP 429 error from an XMTP network node and must wait for the next 5-minute window.

### How do I avoid exceeding rate limits?

[Use broadcast tools](#use-broadcast-tools) that manage rate-limiting and error handling.

If you prefer to handle rate-limiting manually, here are some tips:

- Send messages in batches
- Spread your requests over 5 minutes  
- Use multiple IPs to make requests  
- Implement error handling that can manage rate-limiting responses from the network, including adjusting send rates and retrying failed messages.
- Bulk `canMessage` makes API calls in 50-address batches.

## Broadcast best practices

- **Depending on where you’re based**, you could be subject to data privacy laws, including but not limited to GDPR and CCPA.

- **If your app sends broadcast messages to your users**, get user consent before sending them broadcast messages. For example, you can request this consent during onboarding. Here's some example text you can build upon:

  > (&nbsp;&nbsp;) **Yes**, I want to receive broadcast messages from &lt;app name&gt;.
  >
  > These messages may include updates, promotions, and other relevant information.
  >
  > You can unsubscribe at any time by adjusting your notification settings within the app or by replying “STOP” to a broadcast message.
  >
  > We value your privacy and will use your contact information only to send these broadcast messages.
  >
  > By clicking **Continue**, you confirm that you agree to receive broadcast messages from &lt;app name&gt;.
  >
  > (&nbsp;&nbsp;) **No**, I don’t want to receive broadcast messages from &lt;app name&gt;.
  >
  > [Cancel]&nbsp;&nbsp;&nbsp;[**Continue**]

  If it suits your use case, consider handling consent using a [**Subscribe** button with consent proofs](/consent/subscribe) on a web page or in a dapp. 

- **If your app allows your customers to send broadcast messages to their users**, be sure to advise your customers to get their users' consent before sending them broadcast messages. For example, you can provide this guidance during onboarding. Here's some example text you can build upon:

  > By signing up to use this app, you agree to get consent from your users before sending them broadcast messages using this platform. When requesting user consent, let users know what kinds of message content they can expect to receive and how you'll use their contact information.
  >
  > Also be sure to provide users with a way to unsubscribe from your broadcast messages, such as via notification settings or by replying "STOP" to a broadcast message.

- **If your app stores a signature on a server to read and send XMTP messages on behalf of your customer**, such as automated broadcast messages, be sure to let your customer know. Ideally, your app should also periodically auto-delete signatures and provide a way for a customer to manually revoke their signature. For example, you can provide this guidance as a part of the XMTP connection flow. Here's some example text and UX you can build upon:

  For example:

  - Before connection:

    > You’ll be prompted to provide a signature that gives this app permission to read and send XMTP messages on your behalf. The signature will be securely stored and accessed only to execute your workflows. You’ll be able to revoke permission at any time using the Delete signature option that will appear here.

    ![Signature storage disclosure before connection](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/sig-store-disclosure-connect.png)

  - After connection:

    > The signature you provided gives this app permission to read and send XMTP messages on your behalf. The signature is securely stored and accessed only to execute your workflows. Click **Delete signature** to revoke this permission and delete the signature from storage.

    ![Signature storage disclosure and delete after connection](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/sig-store-disclosure-delete.png)
