import {NextResponse} from "next/server";
import {isWebhookEvent, WebhookEvent} from "../../../backend/models/WebhookEvent";
import {webhookEventBusService} from "../../../backend/services/bus/impl/WebhookEventBusService";

export async function POST(req: Request) {

  const webhookEvent: WebhookEvent | null | {} = await req.json();

  if (!webhookEvent || !isWebhookEvent(webhookEvent)) {
    return NextResponse.json({
      status: 400,
    });
  }

  webhookEventBusService.emitNewEvent(webhookEvent);

  return NextResponse.json({
    status: 200,
  });
}