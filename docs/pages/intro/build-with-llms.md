# Use XMTP documentation with AI coding assistants

Here are instructions for integrating the XMTP documentation `llms.txt` file with common AI coding assistants.

## Cody

Add `llms.txt` as a context file:

1. Open Cody in your IDE.
2. Go to Cody settings.
3. Under "Context" or "Additional Context", add the URL to the `llms.txt` file. For example:

  ```json
    "cody.agentic.context.experimentalOptions": {
    "additionalUrls": [
      "https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/llms/llms.txt",
    ]
  ```

In most cases, Cody should automatically use the XMTP documentation context without an explicit prompt, as long as Cody can detect that your question is clearly about XMTP. That said, an explicit reference can help. For example:

```
Using the XMTP documentation context, how do I create a new conversation in React Native?
```

## Cursor

### Add as a knowledge file

1. In Cursor, go to Settings > AI > Knowledge
2. Click "Add Knowledge"
3. Select "File" and upload the llms.txt file
4. Name it "XMTP Documentation"

### Use in queries

- When asking questions, use the `/knowledge` command:

  ```
  /knowledge XMTP Documentation How do I create a group chat in Swift?
  ```

- Enable the knowledge file for the current chat session using the knowledge panel

## GitHub Copilot

GitHub Copilot doesn't directly support loading external context files, but you can:

1. Include the llms.txt in your workspace:
- Download the llms.txt file to your project directory
- Place it in a docs folder within your project
- Copilot will automatically index this file as part of your workspace

2. Reference in comments:
- When you need help with XMTP, add a comment that references the documentation:

  ```
  // Using XMTP documentation from llms.txt
  // How do I create a new conversation in React Native?
  ```

3. Create a custom prompt file:
- Create a file named `.github/copilot/prompts.json` in your repository
- Add a custom prompt that references the XMTP documentation:

  ```json
  {
    "prompts": [
      {
        "name": "XMTP Help",
        "description": "Get help with XMTP SDK",
        "prompt": "Using the XMTP documentation in docs/llms.txt, help me with: {{selection}}"
      }
    ]
  }
  ```

## General tips for all AI assistants

1. Be specific about SDK: Always specify which SDK you're using (React Native, Kotlin, Swift, Browser, or Node) in your queries.

2. Reference documentation explicitly: Include phrases like "according to XMTP documentation" in your prompts.

3. Update regularly: Download a fresh copy of llms.txt periodically to ensure you have the latest documentation.

4. Local copy: For best performance, keep a local copy of the file rather than repeatedly downloading it.

By following these instructions, you'll be able to use AI coding assistants to help you build with XMTP more efficiently, with accurate and up-to-date guidance directly from the official documentation.
