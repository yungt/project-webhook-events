import {NextResponse} from "next/server";
import {WebhookEvent} from "../../../backend/models/WebhookEvent";
import {webhookEventBusService} from "../../../backend/services/bus/impl/WebhookEventBusService";

export async function POST(req: Request) {

  const webhookEvent: WebhookEvent = await req.json();

  webhookEventBusService.emitNewEvent(webhookEvent);

  return NextResponse.json({
    status: 200,
  });
}