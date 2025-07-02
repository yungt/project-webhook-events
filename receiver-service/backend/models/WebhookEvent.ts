import {WebhookEventPayload} from "./WebhookEventPayload";

export type WebhookEvent = {
  id: string,
  timestamps: string,
  event_type: string,
  payload: WebhookEventPayload,
}