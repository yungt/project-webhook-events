import {WebhookEvent} from "../../models/WebhookEvent";

export const sortedTimestampDescending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const sortedTimestampAscending = (input: Array<WebhookEvent>) => {
  return input.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}