// There is nothing to sort for eventType and payload since we filtered to only accept event_type "woof",
// and payload.actor "platform_engineering"
// Currently we are filter on payload.actor, but we can configure to sort on the whole payload data instead.
import {WebhookEvent} from "../../models/WebhookEvent";

export const sortedEventTypeDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => b.event_type.localeCompare(a.event_type));
}
export const sortedEventTypeAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => a.event_type.localeCompare(b.event_type));
}