# Debug your inbox app

This document covers tools and features available for debugging building with XMTP, including stress testing, group chat diagnostics, logging, and network monitoring capabilities.

## XMTP Debug

You can use the XMTP Debug tool to stress and burn-in test your inbox app on the `local` and `dev` XMTP environments.

To learn more, see [XMTP Debug](https://github.com/xmtp/libxmtp/blob/main/xmtp_debug/README.md).

## Forked group debugging tool

A conversation now has `getDebugInformation`. You can use this to see:

- The MLS epoch of a group chat conversation for a member
- Whether a group chat might be forked for a member
- Details of a potential fork

The function that provides this information is called `maybeForked` because it is difficult to be 100% certain whether a group is forked.

- If `maybeForked` returns `true`, it is highly likely that the group chat is forked.
- If `maybeForked` returns `false`, it is highly likely that the group chat is NOT forked.

To learn about group chat forks, see [MLS Group State Forks: What, Why, How](https://cryspen.com/post/mls-fork-resolution/).

If you believe you are experiencing a forked group, please [open an issue](https://github.com/xmtp/libxmtp/issues) in the LibXMTP repo to get support. Please include logs, the epoch, and other fork details.

Forked groups are not recoverable. Your options are to:

- Remove all members from the forked group and then re-add them to the group.
- Start a new group.

## File logging

You can use file logging to debug complex issues. It keeps a 6-hour window of logs that get written and rolled every hour.

## Network statistics

A client has a function called `getNetworkStatistics`. These statistics are maintained per client instance, so each app installation has its own separate counters.

You can use these statistics to see which and how many API, identity, and streaming calls are going across the network at any moment. This information can help you better manage network usage and debug potential rate limiting issues.

### Get aggregated statistics

Use the `XXXXXXXX` function to return these aggregated statistics.

```text
Aggregate Stats:
============ Api Stats ============
UploadKeyPackage        1
FetchKeyPackage         2
SendGroupMessages       5
SendWelcomeMessages     1
QueryGroupMessages      7
QueryWelcomeMessages    0
SubscribeMessages       0
SubscribeWelcomes       0
============ Identity ============
PublishIdentityUpdate    1
GetIdentityUpdatesV2     4
GetInboxIds             2
VerifySCWSignatures     0
============ Stream ============
SubscribeMessages        0
SubscribeWelcomes       0
```

### Get an individual statistic

Use the `XXXXXXXX` function to return an individual statistic as a number. For example, you can just `xxxxxx` to track `uploadKeypackage` only.

### Statistic descriptions

#### API statistics

| Statistic | Description |
|-----------|-------------|
| UploadKeyPackage | Number of key packages being uploaded. |
| FetchKeyPackage | Number of key packages being fetched. |
| SendGroupMessages | Number of messages being sent to group chat and DM conversations. |
| SendWelcomeMessages | Number of welcome messages being sent. |
| QueryGroupMessages | Number of queries being made to fetch messages being sent to group chat and DM conversations. |
| QueryWelcomeMessages | Number of queries being made to fetch welcome messages. |
| SubscribeMessages | Number of message subscription requests being made. |
| SubscribeWelcomes | Number of welcome message subscription requests being made. |

#### Identity statistics

| Statistic | Description |
|-----------|-------------|
| PublishIdentityUpdate | Number of identity updates being published. |
| GetIdentityUpdatesV2 | Number of identity updates being fetched. |
| GetInboxIds | Number of inbox ID queries being made. |
| VerifySCWSignatures | Number of smart contract wallet signature verifications being performed. |

#### Stream statistics

| Statistic | Description |
|-----------|-------------|
| SubscribeMessages | Number of message subscription requests being made. |
| SubscribeWelcomes | Number of welcome message subscription requests being made. |
