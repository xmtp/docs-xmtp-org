# Use XMTP documentation with AI coding assistants

Here are instructions for integrating the XMTP documentation (llms.txt) with popular AI coding assistants:

## Sourcegraph Cody

1. Add as a context file:

- Open Cody in your IDE (VS Code, JetBrains, etc.)
- Go to Cody settings
- Under "Context" or "Additional Context", add the URL to the raw llms.txt file:

  ```
  https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/llms/llms.txt
  ```

- Alternatively, download the file locally and add it as a local context file

### Use with Cody Chat

When asking questions about XMTP, you can explicitly reference the documentation:

```
Using the XMTP documentation context, how do I create a new conversation in React Native?
```

## Cursor

Cursor has support for external context.

1. Add as a knowledge file:
- In Cursor, go to Settings > AI > Knowledge
- Click "Add Knowledge"
- Select "File" and upload the llms.txt file
- Name it "XMTP Documentation"

2. Using in queries:
- When asking questions, use the /knowledge command:

  ```
  /knowledge XMTP Documentation How do I create a group chat in Swift?
  ```

- Or enable the knowledge file for the current chat session using the knowledge panel

3. Automatic context:
- Alternatively, download the file to your project
- Cursor will automatically include relevant parts when you ask XMTP-related questions

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
