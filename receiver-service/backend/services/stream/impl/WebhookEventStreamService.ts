import {WebhookEvent} from "../../../models/WebhookEvent";
import {webhookEventBusService} from "../../bus/impl/WebhookEventBusService";

const HEARTBEAT_DELAY = 30000;

export class WebhookEventStreamService implements IEventStreamService {
  private encoder = new TextEncoder();

  getCustomReadable(): ReadableStream {
    return new ReadableStream({
      start: (controller) => {
        // Send initial connection message
        const initialData = `data: {"message": "SSE connection established"}\n\n`;
        controller.enqueue(this.encoder.encode(initialData));

        // Webhook event handler
        const handleNewEvent = (webhookEvent: WebhookEvent) => {
          const data = `data: ${JSON.stringify({
            type: "webhook",
            data: webhookEvent,
            timestamp: new Date().toISOString()
          })}\n\n`;

          try {
            controller.enqueue(this.encoder.encode(data));
          } catch (error) {
            console.log("Stream closed, removing listener");
            webhookEventBusService.removeNewEventListener(handleNewEvent);
          }
        };

        // Register webhook listener
        webhookEventBusService.onNewEvent(handleNewEvent);

        // Heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
          try {
            const heartbeat = `data: {"type": "heartbeat", "timestamp": "${new Date().toISOString()}"}\n\n`;
            controller.enqueue(this.encoder.encode(heartbeat));
          } catch (error) {
            clearInterval(heartbeatInterval);
            webhookEventBusService.removeNewEventListener(handleNewEvent);
          }
        }, HEARTBEAT_DELAY);

        // Cleanup function
        return () => {
          clearInterval(heartbeatInterval);
          webhookEventBusService.removeNewEventListener(handleNewEvent);
          controller.close();
        };
      }
    });
  }
}

export const webhookEventStreamService = new WebhookEventStreamService();