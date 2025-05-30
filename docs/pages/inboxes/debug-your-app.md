# Debug your inbox app

This document covers tools and features available for debugging building with XMTP, including stress testing, group chat diagnostics, logging, and network monitoring capabilities.

## XMTP Debug

You can use the XMTP Debug tool to stress and burn-in test your inbox app on the `local` and `dev` XMTP environments.

To learn more, see [XMTP Debug](https://github.com/xmtp/libxmtp/blob/main/xmtp_debug/README.md).

## Forked group debugging tool

:::tip[Preventing forks is XMTP’s responsibility]

This tool helps you identify potential forked groups in your app, but preventing forks in the first place is XMTP's responsibility. This diagnostic tool is just a temporary aid, not a shift in responsibility to your app.

:::

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

These file logging functions enable the XMTP rust process to write directly to persistent log files that roll during every hour of active usage and provide a 6-hour window of logs. This can be especially helpful when debugging group chat errors and other complex issues.

The file logs complement Android and iOS system logs, which rely on memory buffer constraints, but often don't go back far enough to help catch when an issue occurs.

To use file logging, call the following static functions:

- `Client.activatePersistentLibXMTPLogWriter()`: Use to activate the file logging feature.
  - We recommend using `LogLevel.Debug`, `LogRotation.Hourly`, and a `logMaxFiles` value of 5-10. Log files can grow to ~100mb each with active clients on debug level in an hour of usage.
- `Client.getXMTPLogFilePaths()`: Use to get the full paths of log files written so far. This is useful for passing to iOS or Android Share functions.
- Here are additional helper static functions in the XMTP Client object:
  - `deactivatePersistentLibXMTPLogWriter()`
  - `isLogWriterActive()`
  - `readXMTPLogFile()`
  - `clearXMTPLogs()`

For an example UI implementation, see PR to [add new persistent log debug menu options](https://github.com/ephemeraHQ/convos-app/pull/6) to the Convos app, built with XMTP.

## Network statistics

You can use these statistics to see which and how many API, identity, and streaming calls are going across the network, which can help you better manage network usage and debug potential rate limiting issues.

A client has a function called `client.debugInformation` These statistics are maintained per client instance, so each app installation has its own separate counter. Each one is a rolling counter for the entire session since the gRPC client was created. To get a snapshot of statistics at a moment in time, you can check the counter, run the action, get the counter again, and then diff the counter with the original counter.

### Get aggregated statistics

Use the `client.debugInformation.aggregateStatistics` function to return these aggregated statistics.

```text
Aggregate Stats:
============ Api Stats ============
UploadKeyPackage        1
FetchKeyPackage         2
SendGroupMessages       5
SendWelcomeMessages     1
QueryGroupMessages      7
QueryWelcomeMessages    0
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

You can return an individual statistic as a number. For example, you can run `client.debugInformation.apiStatistics.uploadKeyPackage` to track `uploadKeypackage` only.

### Statistic descriptions

#### API statistics

| Statistic | Description |
|-----------|-------------|
| UploadKeyPackage | Number of times key packages have been uploaded. |
| FetchKeyPackage | Number of times key packages have been fetched. |
| SendGroupMessages | Number of times messages have been sent to group chat and DM conversations. |
| SendWelcomeMessages | Number of times welcome messages have been sent. |
| QueryGroupMessages | Number of times queries have been made to fetch messages being sent to group chat and DM conversations. |
| QueryWelcomeMessages | Number of times queries have been made to fetch welcome messages. |

#### Identity statistics

| Statistic | Description |
|-----------|-------------|
| PublishIdentityUpdate | Number of times identity updates have been published. |
| GetIdentityUpdatesV2 | Number of times identity updates have been fetched. |
| GetInboxIds | Number of times inbox ID queries have been made. |
| VerifySCWSignatures | Number of times smart contract wallet signature verifications have been performed. |

#### Stream statistics

| Statistic | Description |
|-----------|-------------|
| SubscribeMessages | Number of times message subscription requests have been made. This is streaming messages in a conversation. |
| SubscribeWelcomes | Number of times welcome message subscription requests have been made. This is streaming conversations. |
