import {EventEmitter} from "events";
import {WebhookEvent} from "../../../models/WebhookEvent";
import {IEventBusService} from "../IEventBusService";

export class WebhookEventBusService extends EventEmitter implements IEventBusService<WebhookEvent> {
  private static instance: WebhookEventBusService;

  static getInstance(): WebhookEventBusService {
    if (!WebhookEventBusService.instance) {
      WebhookEventBusService.instance = new WebhookEventBusService();
    }
    return WebhookEventBusService.instance;
  }

  emitNewEvent(webhookEvent: WebhookEvent) {
    try {
      this.emit("webhook", webhookEvent);
    } catch (error) {
      console.error('Error emitting webhook event:', error);
    }
  }

  onNewEvent(callback: (webhookEvent: WebhookEvent) => void) {
    try {
      this.on("webhook", callback);
    } catch (error) {
      console.error('Error in webhook event listener:', error);
    }
  }

  removeNewEventListener(callback: (webhookEvent: WebhookEvent) => void) {
    this.removeListener("webhook", callback);
  }
}

export const webhookEventBusService = WebhookEventBusService.getInstance();