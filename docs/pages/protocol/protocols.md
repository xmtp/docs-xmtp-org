---
description: "Get an overview of the protocols that form XMTP"
---

# Overview of XMTP protocols

## Conversations protocol

The conversations protocol contains methods to create groups, and monitor all groups the installation is part of. Each SDK has its own version of this protocol, using the underlying implementation in [LibXMTP](https://github.com/xmtp/libxmtp).

| Method | Description |
| ---- | ---- |
| create_group | Create a new group chat for multiple account addresses. Syncs automatically.|
| sync | Sync for welcome messages, creating new groups if one is found. |
| list | Returns a list of groups matching the chosen time frame and limit. Requires sync. |
| stream | Streams messages from the current group id to a callback function. |
| stream_all_messages | Streams all messages to a callback function. |

## Group protocol

The Group protocol contains methods specific to individual groups, identified by their `group_id`. These methods allow a user to communicate with the group. Each SDK has its own version of this protocol, using the underlying implementation in [LibXMTP](https://github.com/xmtp/libxmtp).

| Method | Description |
| ---- | ---- |
| send | Send a message to this group. Requires sync. |
| sync | Query for new messages, proposals, and commits, and send unpublished messages related to this group. |
| find_messages | Query the database for stored messages, with filters for time frame and limit. Requires sync.|
| list_members | A list including the inboxId of each member and their associated account addresses. Requires sync. |
| add_members | Add multiple group members by account address. Syncs automatically.|
| add_members_by_inbox_id | Add multiple group members by inboxId.  Syncs automatically.|
| remove_members | Remove multiple group members by account address. Syncs automatically.|
| remove_members_by_inbox_id | Remove multiple group members by inboxId.  Syncs automatically.|
| stream | Stream messages to a callback function. Syncs automatically.|
| created_at_ns | Group creation time. |
| is_active | Whether the group is active. Requires sync. |
| added_by_inbox_id | The inboxId of the group member who added this user to the group. |
| group_metadata | Group metadata, such as group title and permissions. Requires sync.|
