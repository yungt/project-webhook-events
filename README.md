# Webhook Event Project
This project contains 3 components, and 1 docs folder:
- `webhok_service` - emits webhook events
- `receiver-service` - receive webhook events (also contains an in-mem event bus to support client event subscription)
- `receiver-frontend` - display webhook events
- `docs` - contains system design diagram & feedback / notes

Please check out `README.md` file located in each component folder.

### Build and start all three services using docker compose
```
docker-compose up --build
```

### Stop all services
```
docker-compose down
```

### Check services
- Open 'http://localhost:3002' on your bowser. If all services are running, webhook event data should be populated in the table (between 1-5s).

#### Services and port number
- `webhook_service` is running on port `3000`
- `receiver-service` is running on port `3001`
- `receiver-frontend` is running on port `3002`

### Documents
Diagram and feedback/notes (required in System Requirement #2) is located in `/docs`.

