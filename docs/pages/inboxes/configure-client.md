# Configure an XMTP client

You can configure an XMTP client with these parameters of `Client.create`:

| Parameter       | Default                | Description                                  |
| --------------- | ---------------------- | -------------------------------------------- |
| env             | `DEV`                  | Connect to the specified XMTP network environment. Valid values include `DEV`, `PRODUCTION`, or `LOCAL`. For important details about working with these environments, see [XMTP DEV, PRODUCTION, and LOCAL network environments](#xmtp-production-and-dev-network-environments). |
| appContext      | `REQUIRED`             | The app context used to create and access the local database. |
| dbEncryptionKey | `REQUIRED`             | A 32-byte `ByteArray` used to encrypt the local database. |
| historySyncUrl  | `https://message-history.dev.ephemera.network/` | The history sync URL used to specify where history can be synced from other devices on the network. |
| appVersion      | `undefined`            | Add a client app version identifier that's included with API requests.<br/>For example, you can use the following format: `appVersion: APP_NAME + '/' + APP_VERSION`.<br/>Setting this value provides telemetry that shows which apps are using the XMTP client SDK. This information can help XMTP core developers provide support to app developers, especially around communicating important SDK updates, including deprecations and required updates. |

## XMTP DEV, PRODUCTION, and LOCAL network environments

XMTP provides `DEV`, `PRODUCTION`, and `LOCAL` network environments to support the development phases of your project.

The `PRODUCTION` and `DEV` networks are completely separate and not interchangeable.

For example, an XMTP identity on the `DEV` network is completely distinct from the XMTP identity on the `PRODUCTION` network, as are the messages associated with these identities. In addition, XMTP identities and messages created on the `DEV` network can't be accessed from or moved to the `PRODUCTION` network, and vice versa.

:::tip
When you [create a client](/inboxes/build-inbox/#create-an-xmtp-client), it connects to the XMTP `DEV` environment by default. Use the `env` parameter to explicitly set your client's network environment.
:::

Here are some best practices for when to use each environment:

- `DEV`: Use to have a client communicate with the `DEV` network. As a best practice, set `env` to `DEV` while developing and testing your app. Follow this best practice to isolate test messages to `DEV` inboxes.

- `PRODUCTION`: Use to have a client communicate with the `PRODUCTION` network. As a best practice, set `env` to `PRODUCTION` when your app is serving real users. Follow this best practice to isolate messages between real-world users to `PRODUCTION` inboxes.

- `LOCAL`: Use to have a client communicate with an XMTP node you are running locally. For example, an XMTP node developer can set `env` to `LOCAL` to generate client traffic to test a node running locally.

The `PRODUCTION` network is configured to store messages indefinitely. XMTP may occasionally delete messages and keys from the `DEV` network, and will provide advance notice in the [XMTP Community Forms](https://community.xmtp.org/).
