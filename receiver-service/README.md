# receiver-service
A receiver service (Typescript and NextJS) that is capable of responding to HTTP requests sent by the webhook_service.

### Run and build using docker

#### Build
```
docker -t receiver-frontend .
```

#### Run
```
docker run -p 3001:3001 --name receiver-frontend receiver-frontend
```

Open `http://localhost:3001` to view service

Alternatively, all services can be build and run using `docker-compose.yaml` in the root folder

### Run and build without docker

#### Build
```
npm run build
```

#### Run
```
npm run start
```

Port `3001` is already set in `package.json` `script`
#### Development
```
npm run dev
```

Open `http://localhost:3001` to view service

### API
POST /api/webhook

- `WebhookEvent`:
  - id: string - ID of the event
  - timestamps: string - Timestamp of event
  - event_type: string - Event type ("woof" | "bark")
  - payload: `WebhookEventPayload`
- `WebhookEventPayload`:
  - actor: string - Actor value

GET /api/events

Subscribe to events