import {WebhookEvent} from "./WebhookEvent";

export type EventSubscription = {
  type: string,
  data: WebhookEvent,
  timestamp: string,
}