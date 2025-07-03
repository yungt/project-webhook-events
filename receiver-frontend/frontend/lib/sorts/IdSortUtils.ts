import {WebhookEvent} from "../../models/WebhookEvent";

export const sortedIdDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => b.id.localeCompare(a.id));
}

export const sortedIdAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => a.id.localeCompare(b.id));
}