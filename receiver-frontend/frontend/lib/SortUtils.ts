import {SortTypes} from "./SortTypes";
import {WebhookEvent} from "../models/WebhookEvent";

export const sortedTimestampDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
export const sortedTimestampAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
export const sortedIdDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => b.id.localeCompare(a.id));
}
export const sortedIdAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => a.id.localeCompare(b.id));
}

// There is nothing to sort for eventType and payload since we filtered to only accept event_type "woof",
// and payload.actor "platform_engineering"
// Currently we are filter on payload.actor, but we can configure to sort on the whole payload data instead.
export const sortedEventTypeDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => b.event_type.localeCompare(a.event_type));
}
export const sortedEventTypeAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => a.event_type.localeCompare(b.event_type));
}
export const sortedPayloadDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => b.payload.actor.localeCompare(a.payload.actor));
}
export const sortedPayloadAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => a.payload.actor.localeCompare(b.payload.actor));
}

export const sortStrategies = {
  [SortTypes.TIMESTAMP_DESCENDING]: sortedTimestampDescending,
  [SortTypes.TIMESTAMP_ASCENDING]: sortedTimestampAscending,
  [SortTypes.ID_DESCENDING]: sortedIdDescending,
  [SortTypes.ID_ASCENDING]: sortedIdAscending,
  [SortTypes.EVENT_TYPE_DESCENDING]: sortedEventTypeDescending,
  [SortTypes.EVENT_TYPE_ASCENDING]: sortedEventTypeAscending,
  [SortTypes.PAYLOAD_DESCENDING]: sortedPayloadDescending,
  [SortTypes.PAYLOAD_ASCENDING]: sortedPayloadAscending,
} as const;