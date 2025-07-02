import {WebhookEvent} from "../models/WebhookEvent";

const URL = process.env.RECEIVER_SERVICE_EVENTS_URL || "";

interface EventHandlers {
  onOpen?: () => void,
  onWebhookEvent?: (webhookEvent: WebhookEvent) => void,
  onError?: () => void,
}

class EventSubscriptionClient {
  private eventSource: EventSource | null = null;
  private readonly eventUrl = URL;
  private handlers: EventHandlers = {};

  subscribe(handlers: EventHandlers) {
    this.handlers = handlers;

    if (!this.eventSource) {
      this.eventSource = new EventSource(this.eventUrl);
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    if (!this.eventSource) return;

    this.eventSource.onopen = () => {
      this.handlers.onOpen?.();
    };

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "webhook") {
        const webhookEvent: WebhookEvent = data.data;
        this.handlers.onWebhookEvent?.(webhookEvent);
      }
    };

    this.eventSource.onerror = () => {
      this.handlers.onError?.();
    };
  }

  unsubscribe() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.handlers = {};
  }
}

export const eventSubscriptionClient = new EventSubscriptionClient();
