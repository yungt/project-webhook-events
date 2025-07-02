import {webhookEventBusService} from "../../../backend/services/impl/WebhookEventBusService";
import {WebhookEvent} from "../../../backend/models/WebhookEvent";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3002',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function GET() {

  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      const initialData = `data: {"message": "SSE connection established"}\n\n`;
      controller.enqueue(encoder.encode(initialData));

      // listen
      const handleNewEvent = (webhookEvent: WebhookEvent) => {
        const data = `data: ${JSON.stringify({
          type: "webhook",
          data: webhookEvent,
          timestamp: new Date().toISOString()
        })}\n\n`;

        try {
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          // Stream might be closed
          console.log("Stream closed, removing listener");
          webhookEventBusService.removeNewEventListener(handleNewEvent);
        }
      };

      // register listener
      webhookEventBusService.onNewEvent(handleNewEvent);

      // heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = `data: {"type": "heartbeat", "timestamp": "${new Date().toISOString()}"}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          clearInterval(heartbeatInterval);
          webhookEventBusService.removeNewEventListener(handleNewEvent);
        }
      }, 30000);

      // cleanup
      return () => {
        clearInterval(heartbeatInterval);
        webhookEventBusService.removeNewEventListener(handleNewEvent);
        controller.close();
      };

    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': 'http://localhost:3002',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*',
    },
  });

}