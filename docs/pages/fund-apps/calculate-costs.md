## Step 1: Calculate Your Costs

### How XMTP Pricing Works

### Simple, Volume-Based Pricing

XMTP uses straightforward pay-as-you-go pricing that benefits from network scale:

| Your Monthly Active Users | Estimated Monthly Cost | Cost per User |
| --- | --- | --- |
| 10,000 MAU | ~$150/month | $0.015 |
| 100,000 MAU | ~$1,500/month | $0.015 |
| 1 Million MAU | ~$15,000/month | $0.015 |
| 10 Million MAU | ~$150,000/month | $0.015 |

*Based on average usage of 300 messages per user per month*

### What Counts as a Message?

**Everything your application sends through XMTP counts toward your message volume:**

- User messages (text, reactions, replies)
- Media attachments (charged by size, capped at 1MB)
- System messages (read receipts, typing indicators)
- Group management (member additions, permission changes)
- Identity updates and consent preferences

> About pricing: The $5 per 100K messages is an all-inclusive estimate based on typical usage patterns (1KB average message size and 1-2 group operations per 100 messages). Apps with heavy media usage or frequent group operations may see costs vary by 10-20%, but for most applications, this estimate holds true.
> 

[Placeholder: Visual breakdown showing different message types and their typical sizes]

### Future Price Reductions

As the network grows, per-message costs will decrease for everyone:

- **Today**: $5 per 100K messages (estimated all-in cost)
- **At scale**: $3 per 100K messages
- **Long-term target**: $1 per 100K messages

The more applications join the network, the lower costs become for all participants.

### Detailed Cost Breakdown by Message Type

| Content Type | Typical Size | Messages per $1 | Monthly Cost (1M msgs) |
| --- | --- | --- | --- |
| Text message | 1 KB | 20,000 | $50 |
| Reaction/receipt | 500 bytes | 40,000 | $25 |
| Photo (compressed) | 500 KB | 40 | $25,000 |
| Group update | 2 KB | 10,000 | $100 |

### Calculating Your Specific Costs

**Example: Social app with 50,000 MAUs**

- Users send ~10 messages/day
- 50,000 × 10 × 30 = 15M messages/month
- Include system messages: ~20M total
- **Monthly cost**: $1,000 (at launch rates)

This estimate includes typical group operations and blockchain costs.

**Cost calculation checklist**:

- [ ]  Count all message types your app sends
- [ ]  Include automated messages (notifications, updates)
- [ ]  Factor in media usage patterns
- [ ]  Consider frequency of group operations
- [ ]  Add 20-30% buffer for growth and variance
- [ ]  Use the [Cost Calculator](https://claude.ai/chat/URL-placeholder)


## Cost Optimization Strategies

### Quick Wins

- **Message batching**: Group notifications save 50-70%
- **Efficient encoding**: Compress before sending
- **Smart caching**: Reduce duplicate fetches

### Advanced Techniques

- **Remote attachments**: Link vs. embed for media
- **Selective sync**: Only fetch needed conversations
- **Group optimization**: Minimize membership broadcasts

### Impact on Costs

| Optimization | Effort | Cost Reduction |
| --- | --- | --- |
| Batch notifications | Low | 30-50% |
| Compress messages | Low | 10-20% |
| Remote attachments | Medium | 20-40% |
