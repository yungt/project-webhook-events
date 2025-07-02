import {WebhookEventPayload} from "./WebhookEventPayload";

export type WebhookEvent = {
  id: string,
  timestamp: string,
  event_type: string,
  payload: WebhookEventPayload,
}