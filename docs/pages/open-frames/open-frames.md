# Get started with Open Frames for apps built with XMTP

You can support [Frames](https://docs.farcaster.xyz/developers/frames/) in apps built with XMTP by using the [Open Frames](https://www.openframes.xyz) standard. This standard enables you to build a Frame that works in multiple ecosystems, including Farcaster, XMTP, Lens, and others.

This tutorial describes how to display basic, transactional, and subscription Open Frames in an app built with XMTP.

## XMTP apps that support Open Frames

These apps built with XMTP can display Open Frames:

- [Open Frames quickstart](https://github.com/xmtp/xmtp-quickstart-frames/): Test your Open Frames with this quickstart web app
- [Converse](https://converse.xyz): Use Open Frames with Converse Messenger

## Display basic Open Frames

Use this library to display basic Opens Frames in your app built with XMTP: [@xmtp/frames-client](https://github.com/xmtp/xmtp-web/tree/main/packages/frames-client)

## Validate POST payloads from Open Frames

Use these tools to validate create and sign POST payloads from Open Frames used with XMTP: [@xmtp/frames-validator](https://github.com/xmtp/xmtp-node-js-tools/blob/main/packages/frames-validator/)

## Get started with supporting frameworks

### OnchainKit

OnchainKit supports XMTP payloads.

- [OnchainKit documentation](https://onchainkit.xyz/xmtp/introduction): .
- [XMTP x OnchainKit quickstart](https://github.com/daria-github/a-frame-in-100-lines/): .

#### Frame metadata

To build an Open Frame for XMTP, you must first add XMTP metadata:

```tsx [TypeScript]
const frameMetadata = getFrameMetadata({
  /**
   * Frame metadata like Image, Buttons, Input, etc.
   */
  isOpenFrame: true,
  accepts: { xmtp: "vNext" },
});

export const metadata: Metadata = {
  /**
   * ...other metadata
   */
  other: {
    ...frameMetadata,
  },
};
```

#### How to validate incoming messages

```tsx [TypeScript]
import {
  isXmtpFrameRequest,
  getXmtpFrameMessage,
} from "@coinbase/onchainkit/xmtp";
/* ... */
async function getResponse(req: any): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  if (isXmtpFrameRequest(body)) {
    const { isValid, message } = await getXmtpFrameMessage(body);
    // ... do something with the message if isValid is true
    if (isValid) {
      const { verifiedWalletAddress } = message;
      // ... do something with the verifiedWalletAddress
    }
  } else {
    // ...
  }
}
```

### Frames.js

Frames.js supports XMTP payloads.

- [Frames.js documentation](https://framesjs.org/reference/js/xmtp)
- [XMTP x Frames.js quickstart](https://github.com/framesjs/frames.js/tree/main/templates/next-starter-with-examples/)

#### Frame metadata

To build an Open Frame for XMTP, you must first add XMTP metadata:

```tsx [TypeScript]
const acceptedProtocols: ClientProtocolId[] = [
  {
    id: "xmtp",
    version: "vNext",
  },
  {
    id: "farcaster",
    version: "vNext",
  },
];
```

#### How to validate incoming messages

```tsx [TypeScript]
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";

let fid: number | undefined;
let walletAddress: string | undefined;

if (isXmtpFrameActionPayload(previousFrame.postBody)) {
  const frameMessage = await getXmtpFrameMessage(previousFrame.postBody);
  const { verifiedWalletAddress } = frameMessage;
  // Do something with xmtp wallet address
} else {
  // Do something else
}
```

### Frog

- [Frog middle documentation](https://frog.fm/concepts/middleware#xmtp-frames-middleware)
- [XMTP x Frog middle quickstart](https://github.com/fabriguespe/frog-starter)

#### Frame metadata

To build a Frame with XMTP, you must first add XMTP metadata.

```tsx [TypeScript]
const addMetaTags = (client: string, version?: string) => {
  // Follow the OpenFrames meta tags spec
  return {
    unstable_metaTags: [
      { property: `of:accepts`, content: version || "vNext" },
      { property: `of:accepts:${client}`, content: version || "vNext" },
    ],
  };
};

export const app = new Frog(addMetaTags("xmtp"));
```

#### How to validate incoming messages

To validate incoming messages, install the `@xmtp/frames-validator` package:

```bash
npm install @xmtp/frames-validator
```

Then add the middleware:

```tsx [TypeScript]
import { validateFramesPost } from "@xmtp/frames-validator";

const xmtpSupport = async (c: Context, next: Next) => {
  // Check if the request is a POST and relevant for XMTP processing
  if (c.req.method === "POST") {
    const requestBody = (await c.req.json().catch(() => {})) || {};
    if (requestBody?.clientProtocol?.includes("xmtp")) {
      c.set("client", "xmtp");
      const { verifiedWalletAddress } = await validateFramesPost(requestBody);
      c.set("verifiedWalletAddress", verifiedWalletAddress);
    } else {
      // Add farcaster check
      c.set("client", "farcaster");
    }
  }
  await next();
};

app.use(xmtpSupport);
```

#### Access a verified wallet address

```tsx [TypeScript]
app.frame("/", (c) => {
  /* Get Frame variables */
  const { buttonValue, inputText, status } = c;

  // XMTP verified address
  const { verifiedWalletAddress } = c?.var || {};

  /* return */
});
```
