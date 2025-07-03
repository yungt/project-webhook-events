import {WebhookEvent} from "../models/WebhookEvent";
import {EventSubscription} from "../models/EventSubscription";

const URL = process.env.RECEIVER_SERVICE_EVENTS_URL || "";

export interface EventHandlers {
  onOpen?: () => void,
  onWebhookEvent?: (webhookEvent: WebhookEvent) => void,
  onError?: () => void,
}

export class EventSubscriptionClient {
  private eventSource: EventSource | null = null;
  private readonly eventUrl: string;
  private handlers: EventHandlers = {};

  constructor(url: string) {
    this.eventUrl = url;
  }

  subscribe(handlers: EventHandlers) {
    this.handlers = handlers;

    if (!this.eventSource) {
      this.eventSource = new EventSource(this.eventUrl);
      this.setupEventListeners();
    }
  }

  unsubscribe() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.handlers = {};
  }

  private setupEventListeners() {
    if (!this.eventSource) return;

    this.eventSource.onopen = () => {
      this.handlers.onOpen?.();
    };

    this.eventSource.onmessage = (event) => {
      let eventSubscription: EventSubscription | null = null;
      try {
        eventSubscription = JSON.parse(event.data);
      } catch (error) {
        console.log(error);
      }

      if (eventSubscription && eventSubscription.type === "webhook") {
        const webhookEvent: WebhookEvent = eventSubscription.data;
        this.handlers.onWebhookEvent?.(webhookEvent);
      }
    };

    this.eventSource.onerror = () => {
      this.handlers.onError?.();
    };
  }
}

export const eventSubscriptionClient = new EventSubscriptionClient(URL);
