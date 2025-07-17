# FAQ about funding apps

## Do I need Go developers?

Only if you're NOT using Node.js. Node.js has the payer built-in. For all other platforms, you'll need either the Docker image (no Go required) or Go developers for customization.

## How accurate is the $5 per 100K messages estimate?

This estimate assumes typical usage patterns (1KB messages, 1-2 group operations per 100 messages). Most apps fall within 10% of this estimate.

## What if my payer service goes down?

Messages will queue until your payer is back online. Build redundancy if needed. (Node.js apps have payer built-in, reducing this risk.)

## Can someone else pay for my app's messaging?

Yes! Anyone (investors, sponsors, partners) can deposit funds to your wallet through the Payer Portal. You can also manage funds for other developers.

## How much does infrastructure cost?

Node.js apps: No additional infrastructure needed. Other apps: $25-50/month for hosting plus RPC provider costs.
