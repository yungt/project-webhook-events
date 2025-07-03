import {WebhookEventPayload} from "./WebhookEventPayload";

export type WebhookEvent = {
  id: string,
  timestamp: string,
  event_type: string,
  payload: WebhookEventPayload,
}

export function isWebhookEvent(obj: any): obj is WebhookEvent {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.event_type === 'string' &&
    obj.payload !== undefined &&
    typeof obj.payload === 'object'
  );
}