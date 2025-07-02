import {EventEmitter} from "events";
import {WebhookEvent} from "../../models/WebhookEvent";
import {IEventBusService} from "../IEventBusService";

class WebhookEventBusService extends EventEmitter implements IEventBusService<WebhookEvent> {
  private static instance: WebhookEventBusService;

  static getInstance(): WebhookEventBusService {
    if (!WebhookEventBusService.instance) {
      WebhookEventBusService.instance = new WebhookEventBusService();
    }
    return WebhookEventBusService.instance;
  }

  emitNewEvent(webhookEvent: WebhookEvent) {
    this.emit("webhook", webhookEvent);
  }

  onNewEvent(callback: (webhookEvent: WebhookEvent) => void) {
    this.on("webhook", callback);
  }

  removeNewEventListener(callback: (webhookEvent: WebhookEvent) => void) {
    this.removeListener("webhook", callback);
  }
}

export const webhookEventBusService = WebhookEventBusService.getInstance();