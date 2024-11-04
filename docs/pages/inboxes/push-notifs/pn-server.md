# Run a push notification server for an app built with XMTP

This guide supplements the [core instructions](https://github.com/xmtp/example-notification-server-go/blob/np/export-kotlin-proto-code/README.md#local-setup) provided in the `example-notification-server-go` repository. The guide aims to address some common setup misconceptions and issues. 

This guide is for macOS users, but the steps should be similar for Linux users.

## Useful resources

- [Notification server example implementation](https://github.com/xmtp/example-notification-server-go)
- [Notification server integration test suite](https://github.com/xmtp/example-notification-server-go/blob/main/integration/README.md)

## Install Docker

1. Install Docker Desktop:

   - [Mac](https://docs.docker.com/docker-for-mac/install/)
   - [Windows](https://docs.docker.com/docker-for-windows/install/)
   - [Linux](https://docs.docker.com/desktop/install/linux-install/)

2. You must also have Docker and Docker Compose installed on your system. You can install them using Homebrew:

   ```bash [Bash]
   brew install docker docker-compose docker-credential-desktop
   ```

3. Make sure Docker Desktop is running by searching for Docker in Spotlight and opening the application. You don't need to interact with the Docker UI. We're going to use terminal commands only.

## Install Go

If you need to upgrade Go on your system, you can do it via Homebrew:

```bash [Bash]
brew install go
```

If you encounter an error like `Error: go 1.17.2 is already installed`, you already have Go installed on your system. 

You can check the version of Go installed on your system using:

```bash [Bash]
brew update
brew upgrade go
```

After following these steps, you can update Homebrew and upgrade Go without issues.

## Set up the server

1. To start the XMTP service and database, navigate to the project terminal and run:

   ```bash [Bash]
   ./dev/up
   ```

   ![set up the server](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/cmd1.png)

   If you encounter an error like `error getting credentials - err: docker-credential-desktop resolves to executable in current directory (./docker-credential-desktop), out:`, it's likely because Docker is not running. Make sure Docker Desktop is running and try the command again.

2. Build the server using:

   ```bash [Bash]
   ./dev/build
   ```

   During the build, if you encounter any Go-related errors like missing `go.sum` entries, use the suggested `go get` or `go mod download` commands in the error messages to resolve them. For example, if you see `missing go.sum entry; to add it: go mod download golang.org/x/sys`, run:

   ```bash [Bash]
   go mod download golang.org/x/sys
   ```

   If you encounter errors related to Go build comments like `//go:build comment without // +build comment`, you can ignore them as they are warnings about future deprecations and won't prevent your code from running.

## Run the server

Run the server using the `./dev/run` script with the `--xmtp-listener` and `--api` flags:

```bash [Bash]
./dev/up
```

![./dev/up in CLI](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/cmd2.png)

```bash [Bash]
source .env
./dev/run --xmtp-listener --api
```

This starts both the `worker` and `api` services. The `worker` listens for new messages on the XMTP network and sends push notifications. The `api` service handles HTTP/GRPC requests.

![./dev/run --xmtp-listener --api in CLI](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/cmd3.png)

You can now send notifications to your device using an [XMTP push notification client](https://github.com/xmtp/example-notification-server-go/blob/main/docs/notifications-client-guide.md).

![dev/run in CLI](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/cmd4.png)

## Troubleshooting

- If Docker or Docker Compose commands aren't recognized, it might mean that they aren't installed or their executable paths aren't included in your system's PATH variable. Make sure Docker and Docker Compose are installed and their paths are included in your system's PATH.

- If you encounter Go-related errors during the build, it's often due to missing packages or outdated versions. Make sure your Go is up to date and use the `go get` or `go mod download` commands to fetch the necessary dependencies.

- If you encounter any error like `./dev/up: line 3: docker-compose: command not found`, it's because you don't have Docker Compose installed on your system. Use the above command to install it.

- If you see warnings about `//go:build comment without // +build comment`, these are warnings about future deprecations in Go. They won't prevent your code from running and can be ignored.

- If `brew update` gives errors, it might be due to changes in Homebrew's repository. Homebrew switched to using `main` as its default branch. The steps provided in the "Upgrading Go" section should help resolve this issue.

- If you encounter any errors during `brew update`, such as `fatal: couldn't find remote ref refs/heads/master`, Homebrew is having trouble updating its repositories. To fix this, run:

  ```bash [Bash]
  cd $(brew --repository)
  git checkout main
  git reset --hard origin/main
  ```
- Here is a piece of code that points to the ports and network. Be sure to use TLS like this `./dev/run --xmtp-listener-tls --api`.

  ```jsx
  static func envToUrl(env: XMTPEnvironment) -> String {
   switch env {
      case XMTPEnvironment.local: return "http://localhost:5556/"
      case XMTPEnvironment.dev: return "https://dev.xmtp.network:5556/"
      case XMTPEnvironment.production: return "https://production.xmtp.network:5556/"
   }
  }
  ```

- If you run into any other issues or questions, don't hesitate to ask for help in the [XMTP Devs 💪 group chat](https://converse.xyz/group-invite/a0XKzl9oVpWNXcuYDZLMf), powered by XMTP.