# Build with user consent methods with XMTP

Use the following methods to support user consent preferences in your app built with XMTP.

## Deny or allow a contact

To enable your user to deny or allow a contact, call the following methods. Note that these functions accept lists, so you can do batch requests.

:::code-group

```jsx [JavaScript]
// from the client
await client.contacts.allow([address1, address2]);
await client.contacts.deny([address1, address2]);

// from a conversation
await conversation.allow();
await conversation.deny();
```

```jsx [React]
import { useConsent } from "@xmtp/react-sdk";

function ConsentControl({ conversation }) {
  const { allow, deny } = useConsent();

  const handleAllow = async () => {
    await allow([conversation.peerAddress]);
    // Additional UI logic or state updates after allowing
  };

  const handleDeny = async () => {
    await deny([conversation.peerAddress]);
    // Additional UI logic or state updates after denying
  };

  return (
    // ... UI elements that call handleAllow and handleDeny
  );
}
```

```kotlin [Kotlin]
client.contacts.allow([wantedConvo.peerAddress, wantedConvo.peerAddress])
client.contacts.deny([spamConvo.peerAddress, unwantedConvo.peerAddress])
```

```swift [Swift]
try await client.contacts.allow(addresses: [wantedConvo.peerAddress, wantedConvo.peerAddress])
try await client.contacts.deny(addresses: [spamConvo.peerAddress, unwantedConvo.peerAddress])
```

```tsx [React Native]
await client.contacts.allow([wantedConvo.peerAddress, wantedConvo.peerAddress]);
await client.contacts.deny([spamConvo.peerAddress, unwantedConvo.peerAddress]);
```

:::

## Refresh the consent list

To ensure that you’re using the latest consent preferences, make sure to refresh the consent list from the network. Perform the refresh just in case the consent preference has changed on a different device, for example.

`refreshConsentList()` returns the history of all consent entries.

:::code-group

```js [JavaScript]
await client.contacts.refreshConsentList();
```

```jsx [React]
import { useEffect } from "react";
import { useConsent } from "@xmtp/react-sdk";

function ConsentList() {
  const { refreshConsentList } = useConsent();

  useEffect(() => {
    void refreshConsentList();
  }, []);

  // ... UI rendering
}
```

```kotlin [Kotlin]
client.contacts.refreshConsentList()
```

```swift [Swift]
try await client.contacts.refreshConsentList()
```

```tsx [React Native]
await client.contacts.refreshConsentList();
```

:::

## Get the consent list

Load the consent list from a specific time. If no time is specified, it loads the consent list from the last time the refresh was made.

:::code-group

```js [JavaScript]
await client.contacts.loadConsentList(/* Optional: lastSyncedDate */);
```

```jsx [React]
import { useEffect } from "react";
import { useConsent } from "@xmtp/react-sdk";

function LoadConsentList() {
  const { loadConsentList } = useConsent();

  useEffect(() => {
    void (loadConsentList(/* Optional: lastSyncedDate */));
  }, []);

  // ... UI rendering
}
```

```kotlin [Kotlin]
client.contacts.consentList
```

```swift [Swift]
try await client.contacts.consentList
```

```tsx [React Native]
await client.contacts.consentList();
```

:::

## Check if a contact is denied or allowed

Call the following methods to check if a contact is denied or allowed.

:::code-group

```js [JavaScript]
// from the client
const isAllowed = client.contacts.isAllowed(address);
const isDenied = client.contacts.isDenied(address);

// from a conversation
const isAllowed = conversation.isAllowed;
const isDenied = conversation.isDenied;
```

```jsx [React]
import { useConsent } from "@xmtp/react-sdk";

function CheckConsent({ conversation }) {
  const { isAllowed, isDenied } = useConsent();

  useEffect(() => {
    const checkConsent = async () => {
      const allowed = await isAllowed(conversation.peerAddress);
      const blocked = await isDenied(conversation.peerAddress);
      // Use `allowed` and `blocked` for UI updates or logic
    };

    checkConsent();
  }, [conversation.peerAddress]);

  // ... UI rendering based on consent status
}
```

```kotlin [Kotlin]
client.contacts.isAllowed(wantedConvo.peerAddress)
client.contacts.isDenied(spamConvo.peerAddress)
```

```swift [Swift]
await client.contacts.isAllowed(wantedConvo.peerAddress)
await client.contacts.isDenied(spamConvo.peerAddress)
```

```tsx [React Native]
await client.contacts.isAllowed(wantedConvo.peerAddress);
await client.contacts.isDenied(spamConvo.peerAddress);
```

:::

## Get a conversation’s consent preference

When loading a list of conversations, take into account its consent preference. You can get the `consentState` directly from the conversation.

:::code-group

```js [JavaScript]
// from the client
const consentState = client.contacts.consentState(peerAddress);

// from a conversation
const consentState = conversation.consentState;

// consentState can be 'allowed', 'denied', or 'unknown'
```

```jsx [React]
import { useConsent } from "@xmtp/react-sdk";

function ConversationConsent({ conversation }) {
  const { consentState } = useConsent();

  const state = consentState(conversation.peerAddress);
  // state can be 'allowed', 'denied', or 'unknown'

  // ... UI rendering based on the state
}
```

```kotlin [Kotlin]
val state = conversation.consentState()
if (state == ConsentState.DENIED) {
    // hide the conversation
}
```

```swift [Swift]
let state = await conversation.consentState()
if (state == .denied) {
    // hide the conversation
}
```

```tsx [React Native]
const state = await conversation.consentState();
if (state === "denied") {
  // hide the conversation
}
```

:::

## Stream the consent list

This section provides an example of how to stream the consent list. The code snippet below demonstrates how to create a new conversation and then stream the consent list, logging each action to the console.

:::code-group

```js [JavaScript]
const aliceStream = await aliceClient.contacts.streamConsentList();
for await (const action of aliceStream) {
  // Each action indicates the address and if it's allowed or denied
}
await aliceStream.return();
```

```jsx [React]
import { useStreamConsentList } from "@xmtp/react-sdk";

function ConsentListStreamer() {
  const handleAction = (action) => {
    console.log("New action received:", action);
    // You can update your UI or state based on the action here
  };

  const handleError = (error) => {
    console.error("Error in streaming consent list:", error);
    // Handle error state in UI
  };

  const { error } = useStreamConsentList(handleAction, handleError);

  return (
    <div>
      <h3>Consent List Stream</h3>
      {error && <p>Error: {error.message}</p>}
      {/* Additional UI for showing streaming status or actions */}
    </div>
  );
}

export default ConsentListStreamer;
```

```txt [Kotlin]
Code sample coming soon
```

```txt [Swift]
Code sample coming soon
```

```txt [React Native]
Code sample coming soon
```

:::

## Synchronize user consent preferences

All apps that use the user consent feature must adhere to the logic described in this section to keep the consent list on the network synchronized with local app user consent preferences, and vice versa.

:::caution

Do not update the consent list on the network except in the scenarios described below.

:::

Update a consent preference in the consent list on the network in the following scenarios only:

- A user explicitly denies a contact. For example, the user blocks, unsubscribes from, or disables notifications for the contact. The app should update the consent preference in the consent list to `denied`.

- A user explicitly allows a contact. For example, the user allows, subscribes to, or enables notifications for the contact. The app should update the consent preference in the consent list to `allowed`.

- An existing conversation has an `unknown` consent preference, but a legacy consent preference in the local database exists. The app should update the consent preference in the consent list to match the legacy local content preference.

- An existing conversation has an `unknown` consent preference, but has an existing response from the user. The app should update the consent preference in the consent list to `allowed`.

The following diagram illustrates the detailed logic for how user consent preferences are set in an app and in the consent list on the XMTP network.

![](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/consent-state-logic.png)
