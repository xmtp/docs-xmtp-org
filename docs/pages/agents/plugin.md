# XMTP agent plugins

XMTP E2EE agent plugins seamlessly integrate with all AI frameworks and infrastructure, ensuring quick and easy integration.

### Installation

Install the `xmtp` package

```bash [cmd]
bun install xmtp
```

### Usage

This is how you can use the `xmtp` package to create an agent and handle messages.

- `WALLET_PRIVATE_KEY`: This will encrypt all messages and make it available through its public address or ens domain.

```tsx
import { XMTP } from "xmtp";

const xmtp = new XMTP(onMessage, {
  encryptionKey: WALLET_PRIVATE_KEY,
});
await xmtp.init();
const onMessage = async (message, user) => {
  console.log(`Decoded message: ${message.content.text} by ${user.address}`);
  // Your AI model response
  await xmtp.send({
    message: response,
    originalMessage: message,
  });
};
```

For more information visit XMTP [website](https://xmtp.org/)

### GPT example

1. **`handleMessage`**: Triggered each time a new message is received from XMTP.
2. **`client.send()`**: Used to send messages (e.g., AI prompts and responses) back to the XMTP network.

In this example, when `handleMessage` is invoked, it takes the incoming user message, passes it to the AI model (OpenAI's Chat Completion API), and then sends the AI's response back over XMTP.

```javascript
import { XMTP } from "xmtp";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const xmtp = new XMTP(onMessage, {
  encryptionKey: /*wallet private key*/,
});
await xmtp.init();

const onMessage = async (message, user) => {
  console.log(`Decoded message: ${response} by ${user}`);

  // Prepare conversation history or context as needed
  const history = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: message },
  ];

  // Call the OpenAI API to process the user's message
  const response = await openai.createChatCompletion({
    model: process.env.GPT_MODEL || "gpt-4",
    messages: history,
  });

  const response = response.data.choices[0].message.content.trim();

  // Send the AI-generated response back to the XMTP network
  xmtp.send({
    message: response,
    originalMessage: message,
  });
};
```

### React example

_xmtp-e2ee is a light wrapper around the xmtp package to make it easier to use in web._

:::warning[v2 only]
Doesn't support groups yet
:::

```bash [cmd]
bun install xmtp-e2ee
```

```tsx
import { XMTP, Message } from "xmtp-e2ee";
// ... other imports ...

function Chat({ user }: { user: UserInfo }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [xmtp, setXmtp] = useState<XMTP | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  // ... other state variables ...

  useEffect(() => {
    const init = async () => {
      try {
        if (user?.address) {
          await initXmtp(newWallet);
        }
      } catch (error) {
        console.error("Error resolving recipient:", error);
        setIsLoading(false);
      }
    };

    init();
  }, [user.address]);

  const onMessage = async (message: Message | undefined) => {
    if (message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const initXmtp = async (wallet: any) => {
    try {
      const xmtpClient = new XMTP(onMessage);
      await xmtpClient.init();
      setXmtp(xmtpClient);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing XMTP:", error);
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmtp || !newMessage || !recipientInfo?.address) return;

    try {
      const message = await xmtp.send({
        message: newMessage,
        receivers: [recipientInfo.address],
      });
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return <div className={styles.chatContainer}>{/* Render chat UI */}</div>;
}

export default React.memo(Chat);
```
