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
- If `maybeForked` returns `false`, it is highly likely that the group chat is not forked.

To learn about group chat forks, see [MLS Group State Forks: What, Why, How](https://cryspen.com/post/mls-fork-resolution/).

If you believe you are experiencing a forked group, please [open an issue](https://github.com/xmtp/libxmtp/issues) in the LibXMTP repo to get support. Please include logs, the epoch, and other fork details.

Forked groups are not recoverable. Your options are to:

- Remove all members from the forked group and then re-add them.
- Start a new group.

## File logging

You can use file logging to debug complex issues. It keeps a 6-hour window of logs that get written and rolled every hour.

## Network statistics

A client has a function called `getNetworkStatistics`. 

You can use it to see which and how many calls are going across the network. This information can help you better manage network usage and debug potential rate limiting issues.
