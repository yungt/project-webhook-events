# receiver-service
A receiver service (Typescript and Next.js) that is capable of responding to HTTP requests sent by the webhook_service.
This service also includes in-mem SSR to support client subscription on webhook events.

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

#### Test
```
npm run test
```

#### Build
```
npm run build
```
Notes: `prebuild` also triggers `test`

#### Run
```
npm run start -p 3001
```

#### Development
```
npm run dev -p 3001
```

Test the below api with `http://localhost:3001`

### API

**POST /api/webhook**

Description: Allow client to post webhook data to service

Request:

```json
{
  "id": "id",
  "timestamp": "timestamp",
  "event_type": "event_type",
  "payload": {"actor":  "actor"}
}
```

Response:

200 OK
```json
{
  "status": "200"
}
```

400 Bad Request
```json
{
  "status": "400"
}
```
Models:
- `WebhookEvent`:
  - id: string - ID of the event
  - timestamps: string - Timestamp of event
  - event_type: string - Event type ("woof" | "bark")
  - payload: `WebhookEventPayload`
- `WebhookEventPayload`:
  - actor: string - Actor value

**GET /api/events**

Description: Allow client to subscribe to new webhook data

Response:

200 OK
```json
{
  "type": "type",
  "data": "data",
  "timestamp": "timestamp"
}
```

Models:
- `EventSubscription`:
  - type: string - type of the subscription, this case we have webhook
  - data: WebhookEvent
  - timestamp: string - Timestamp of the subscription
