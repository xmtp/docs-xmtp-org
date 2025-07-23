# Understand XMTP messaging fees

## Who pays fees?

Fees are paid by apps and agents to send messages through XMTP.

To learn how to fund your app to pay fees, see [**Quickstart: Fund your app to send messages with XMTP**](https://www.notion.so/Quickstart-Fund-your-app-to-send-messages-with-XMTP-21530823ce9280e887accd97c26a10b3?pvs=21).

## What happens to the collected fees?

Collected fees are paid directly to the node operators who run the [globally distributed nodes]($TODO) that keep the XMTP network secure and censorship resistant.

## What counts as a message?

Everything an app or agent sends through XMTP counts toward its message volume:

- App messages (text, reactions, replies)
- Media attachments (charged by size, capped at 1MB)
- System messages (read receipts, typing indicators)
- Group management (member additions, permission changes)
- Identity updates and consent preferences

To learn more about the message types that clients can publish to XMTP, see [Envelope types](/protocol/envelope-types)

## Fee types

Each message sent through XMTP can incur these fee types:

- **Messaging fees**: Messaging fees are paid directly to independent node operators who power the decentralized XMTP network. The messaging fee is divided into three components:
    - **Base fee**: A flat per-message fee.
    - **Storage fee**: A fee charged per-byte-day of storage required. A 100-byte message stored for 30 days would be calculated as 3,000-byte-days.
    - **Congestion fee**: A dynamic fee computed by looking at the recent activity of an originator. Added only during periods of high network activity.
- **Gas fees**: Charged only for messages that require transactions on the XMTP AppChain. Typically, these are messages for group membership, identity, and funder-related updates.

Both the flat per-message cost and the per-byte-day cost are set through protocol governance and stored in a smart contract. These first two fees are combined into a single `baseFee` that can be computed based on the payload’s size and the length of time it needs to be stored for.

The dollar value of the per-message fee, per-byte-day fee, and congestion fee are stored in a smart contract and remain constant for a specified period of time. These fees can be adjusted through governance.

### How congestion fees are calculated

Each XMTP network node is responsible for keeping track of its own level of congestion and computing a congestion fee for any new message it originates.

Here are the parameters used to calculate the congestion fee:

- `N`: Target capacity of the node, below which we don’t want to charge congestion fees
- `M`: Maximum capacity of a node
- `C`: Multiplier to convert each unit of congestion into dollars

When the message count in the fee calculation window is at or below the target `N`, the fee is 0.

When the message count is at or above the maximum `M`, the fee is 100.

Otherwise, we compute a normalized fraction `x` that represents how far above `N` the current count is relative to the gap `M`−`N`. Then, we apply an exponential curve:

![congestion fee formula](https://community.xmtp.org/uploads/default/optimized/1X/5b0b450522b207793cbd6e977e9015579e4ef657_2_690x71.png)

The final congestion fee in dollars would be `fee * C`

Fees are calculated based on a rolling 5-minute window of messages.

## Estimate an app's monthly costs

XMTP uses pay-as-you-go pricing that benefits from network scale. For example:

| Monthly active users | Estimated monthly cost | Cost per user |
| --- | --- | --- |
| 10,000 MAU | ~$150/month | $0.015 |
| 100,000 MAU | ~$1,500/month | $0.015 |
| 1 Million MAU | ~$15,000/month | $0.015 |
| 10 Million MAU | ~$150,000/month | $0.015 |

*Based on average usage of 300 messages per user per month*

### Detailed cost breakdown by message type

| Content type | Typical size | Messages per $1 | Monthly cost (1M msgs) |
| --- | --- | --- | --- |
| Text message | 1 KB | 20,000 | $50 |
| Reaction/receipt | 500 bytes | 40,000 | $25 |
| Photo (compressed) | 500 KB | 40 | $25,000 |
| Group update | 2 KB | 10,000 | $100 |

## Estimate your app's specific costs

**Example: Social app with 50,000 MAUs**

- Users send ~10 messages/day
- 50,000 × 10 × 30 = 15M messages/month
- Include system messages: ~20M total
- **Monthly cost**: $1,000 (at launch rates)

This estimate includes XMTP Appchain gas fees for typical group membership, identity, and funder-related updates.

**Cost calculation checklist**:

- [ ]  Count all message types your app sends
- [ ]  Include automated messages (notifications, updates)
- [ ]  Factor in media usage patterns
- [ ]  Consider frequency of group operations
- [ ]  Add 20-30% buffer for growth and variance
- [ ]  Use the [XMTP Messaging Costs Calculator](https://claude.ai/chat/URL-placeholder)

## Future price reductions

As the network grows, per-message costs will decrease for everyone:

- **Today**: $5 per 100K messages (estimated all-in cost)
- **At scale**: $3 per 100K messages
- **Long-term target**: $1 per 100K messages

The more apps join the network, the lower costs become for all participants.

> About pricing: The $5 per 100K messages is an all-inclusive estimate based on typical usage patterns (1KB average message size and 1-2 group operations per 100 messages). Apps with heavy media usage or frequent group operations may see costs vary by 10-20%, but for most applications, this estimate holds true.
> 

[Placeholder: Visual breakdown showing different message types and their typical sizes]

## Cost optimization strategies

### Quick wins

- **Message batching**: Group notifications save 50-70%
- **Efficient encoding**: Compress before sending
- **Smart caching**: Reduce duplicate fetches

### Advanced techniques

- **Remote attachments**: Link vs. embed for media
- **Selective sync**: Only fetch needed conversations
- **Group optimization**: Minimize membership broadcasts

### Impact on Costs

| Optimization | Effort | Cost reduction |
| --- | --- | --- |
| Batch notifications | Low | 30-50% |
| Compress messages | Low | 10-20% |
| Remote attachments | Medium | 20-40% |
