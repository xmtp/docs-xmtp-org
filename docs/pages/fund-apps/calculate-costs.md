# Calculate XMTP fees and costs

Use this guide to understand how to calculate your app or agent's estimated XMTP fees and costs.

## Fee types

Each message sent through XMTP can incur these fee types:

- **Messaging fees**: Charged for messages sent through the XMTP Network.
    - **Base fee**: A flat per-message fee.
    - **Storage fee**: A fee charged per-byte-day of storage required. A 100-byte message stored for 30 days would be calculated as 3,000-byte-days.
    - **Congestion fee**: A dynamic fee computed by looking at the recent activity of an originator. Added only during periods of high network activity.
- **Gas fees**: Charged for messages that require transactions on the XMTP Appchain. Typically, these are messages for group membership, identity, and funder-related updates.

The dollar value of the flat per-message base fee, per-byte-day storage fee, and congestion fee are stored in a smart contract and remain constant for a specified period of time. These fees are set and adjusted through protocol governance.

## Estimate XMTP fees and costs

Use these examples to help you estimate costs for your own app or agent.

### Estimate monthly costs

XMTP uses pay-as-you-go pricing that benefits from network scale. For example:

| Monthly active users | Estimated monthly cost | Cost per user |
| --- | --- | --- |
| 10,000 | ~$150/month | $0.015 |
| 100,000 | ~$1,500/month | $0.015 |
| 1 Million | ~$15,000/month | $0.015 |
| 10 Million | ~$150,000/month | $0.015 |

*Based on average usage of 300 messages per user per month*

### Estimate detailed cost breakdowns by message type

| Content type | Typical size | Messages per $1 | Monthly cost (1M messages) |
| --- | --- | --- | --- |
| Text message | 1 KB | 20,000 | $50 |
| Reaction/receipt | 500 bytes | 40,000 | $25 |
| Photo (compressed) | 500 KB | 40 | $25,000 |
| Group update | 2 KB | 10,000 | $100 |

### Estimate congestion fees

Each XMTP Network node is responsible for keeping track of its own level of congestion and computing a congestion fee for any new message it originates.

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

### Estimate your app's specific costs

**Example: Social app with 50,000 monthly active users**

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
- [ ]  Use the [XMTP Messaging Costs Calculator](#TODO)

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

## Pricing and Network Scale

The network is designed for per-message costs to decrease as network volume grows, reflecting economies of scale. The current all-inclusive estimate is **$5 per 100,000 messages**.

This estimate is based on typical usage patterns, such as an average message size of 1 KB and 1-2 group operations per 100 messages. Apps with heavy media usage or frequent group operations might see costs vary, but this estimate is accurate for most use cases.
