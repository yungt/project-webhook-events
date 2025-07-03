# Project Webhook Events

This project contains 3 components, and 1 docs folder:

- `webhok_service` - emits webhook events
- `receiver-service` - receive webhook events (also contains an in-mem event bus to support client event subscription)
- `receiver-frontend` - display webhook events
- `docs` - contains system design diagram & feedback / notes

Please check out `README.md` file located in each component folder.

### Build and start all three services using docker compose

Ensure you already have docker

```
docker-compose up --build
```

**Notes on build time**: Each component `build` also includes `unit test` in `prebuild`, therefore it will increase
build time.
To remove unit tests as part of build, you can comment out `prebuild` in each component's package.json.
(**Keeping unit tests running is recommended.**)

### Stop all services

```
docker-compose down
```

### Checkout WEB UI component (receiver-frontend) after services are up

- Open 'http://localhost:3002' on your bowser. If all services are running, webhook event data should be populated in
  the table (between 1-5s).

#### Services and port number

- `webhook_service` is running on port `3000`
- `receiver-service` is running on port `3001`
- `receiver-frontend` is running on port `3002`

### Documents

- Diagram and feedback/notes (required in System Requirement #2) is located in `/docs`.
- Receiver Service API docs is included in `receiver-service/README.md`


