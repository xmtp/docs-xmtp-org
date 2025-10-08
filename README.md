# Welcome to `docs-xmtp-org`

This is the repo for documentation about XMTP, the Extensible Message Transport Protocol. This repo is open, and contributions from the public are welcome! 🫶

We're glad you're here. 👋

If you're interested in contributing to XMTP documentation, please follow the guidance in this document to help ensure your contribution experience goes as smoothly as possible.

You can contribute by submitting:

- A [bug report](https://github.com/xmtp/docs-xmtp-org/issues/new?assignees=jhaaaa&labels=bug%2C+documentation&projects=&template=bug_report.md&title=)
- A [feature request](https://github.com/xmtp/docs-xmtp-org/issues/new?assignees=jhaaaa&labels=documentation%2C+enhancement&projects=&template=feature_request.md&title=)
- A [pull request](https://github.com/xmtp/docs-xmtp-org/pulls)
  
If you submit a pull request (PR), include a link to the bug report or feature request your PR addresses. If a documentation issue doesn't exist, please [open one](https://github.com/xmtp/docs-xmtp-org/issues) before you start contributing.

Have a question about contributing? Post to the [XMTP Community Forums](https://community.xmtp.org/).

And lastly, when contributing, please follow the XMTP community code of conduct to help create a safe and positive experience for all.

## Use the “Suggest changes to this page” link to submit a pull request

Using the **Suggest changes to this page** link provides a guided flow for editing content and submitting a PR using the GitHub UI in a web browser.

A PR is a request to add (or pull) your content updates into the project and publish them to the documentation on the site. After you submit a pull request, your proposed changes are publicly visible, meaning that anyone with a GitHub account can see them on GitHub.

The **Suggest changes to this page** link allows you to submit a PR to an **existing** documentation page, which makes this feature particularly well-suited to fixing broken links and spelling or grammatical errors.

**To use the Suggest changes to this page link to submit a pull request:**

1. Click the **Suggest changes to this page** link at the bottom of the page you want to fix. The link takes you to the page's markdown file on GitHub.

2. The GitHub UI might tell you that you need to fork the repository to propose changes. Forking the repo means that you're making an editable copy of the `docs-xmtp-org` repo within an org or account you control. Click **Fork this repository** to continue.

3. Edit the markdown file to make your change.

4. Once you're happy with your change, scroll to the bottom of the page to the **Propose changes** section. Add a short description explaining the reason for your change, including a link to the GitHub Issue your PR addresses. GitHub adds this information to the file's changelog, which can help other contributors understand the purpose of your update. Click **Propose changes**.

5. A confirmation page appears. Use it to review your proposed changes. Click **Create pull request**. You have one more chance to review your change on the next page before you submit it to the `docs.xmtp.org` team for review.

6. Now, to finally create your PR! You'll see the change description you entered earlier. You can add some additional information if you want to. Once you're happy with your PR, select **Create pull request**.

7. When you create a PR, the `docs.xmtp.org` team receives a notification to [review it](#what-to-expect).

_The guidance in this section is inspired by the following public sector information licensed under the Open Government Licence v3.0: [Propose a content change using GitHub](https://design-system.service.gov.uk/community/propose-a-content-change-using-github/) by the GOV.UK Design System._

## Manually fork the repo and submit a pull request

Manually fork the `docs-xmtp-org` repo, make your changes, and submit your PR.

To learn more about forking a repo, see [Fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo) in GitHub's documentation.

When you use this technique to submit your PR, you might find it useful to [set up a local environment](#set-up-a-local-environment).

## Set up a local environment

If you are contributing by manually creating a pull request, you might want to set up a local environment where you can build the `docs-xmtp-org` repo and see your changes.

`docs.xmtp.org` is built using [Vocs](https://vocs.dev/), a minimal static documentation generator.

### Install Vocs

See [Getting Started](https://vocs.dev/docs) to learn how to install Vocs.

### Run a local development server

Run this command to start a local development server you can use to view the website.

```bash
$ npm run dev
```

The command opens the website at `http://localhost:5173/` in your default browser.

As you make and save changes to markdown files, the website automatically updates to reflect most changes without having to restart the server.

### Generate and view a local static build

1. Run this command to generate static website content in the `dist` directory.

   ```bash
   $ npm run build
   ```

2. Run this command to start a local server to view the static website content generated in the `dist` directory.

   ```bash
   $ npm run preview
   ```

   The command opens the website at `http://localhost:4173/` in your default browser.

Note that any changes you save to markdown files aren't reflected in this static build because the command serves the website from the `dist` directory, not the editable markdown files.

### Check spelling and markdown formatting

The project includes tools to help maintain documentation quality:

#### Spell checking

```bash
$ npm run spell
```

This checks all markdown files for spelling errors using cspell.

#### Markdown linting

```bash
$ npm run lint:md
```

This checks all markdown files for formatting issues (trailing spaces, missing alt text, etc.).

```bash
$ npm run lint:md:fix
```

This automatically fixes formatting issues that can be corrected automatically (trailing spaces, missing newlines, etc.).

## What to expect

After you've submitted your PR, the `docs.xmtp.org` team will review your PR and either:

- Accept your PR and publish your contribution
- Accept your PR, but request some changes before publishing your contribution
- Not accept your PR and explain why

The `docs.xmtp.org` team includes technical writers, product managers, developers, designers, and other XMTP subject-matter experts. The team reviews documentation PRs based on a few criteria, including:

- Accuracy
- Audience needs
- Adherence to [documentation style guidance](#follow-xmtp-documentation-style-guidance)

## Follow XMTP documentation style guidance

When writing XMTP documentation, follow the [Google developer documentation style guide](https://developers.google.com/style). You might find the [Word list](https://developers.google.com/style/word-list#word-list) particularly useful.

If you can't find the guidance you need in the _Google developer documentation style guide_, follow the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/).

If you need guidance about the spelling of a nontechnical term, follow the [Merriam-Webster Dictionary](https://www.merriam-webster.com/).

XMTP documentation strives to use plain language to ensure that content is clear to as many people as possible. [Plainlanguage.gov](https://www.plainlanguage.gov/) is a great place to learn how to write plainly.
