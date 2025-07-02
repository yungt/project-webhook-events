import {useEffect, useState} from "react";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import {eventSubscriptionClient} from "../../../frontend/clients/EventSubscriptionClient";

export const useEvents = () => {
  const [webhookEvents, setWebhookEvents] = useState<Array<WebhookEvent>>([]);
  const [connected, setConnected] = useState(false);

  const shouldIncludeWebhookEvent = (webhookEvent: WebhookEvent): boolean => {
    return webhookEvent.event_type === "woof" && webhookEvent.payload.actor === "platform_engineer";
  };

  useEffect(() => {
    eventSubscriptionClient.subscribe({
      onOpen: () => setConnected(true),
      onWebhookEvent: (webhookEvent) => {
        if (shouldIncludeWebhookEvent(webhookEvent)) {
          setWebhookEvents(prev => [...prev, webhookEvent]);
        }
      },
      onError: () => setConnected(false)
    });

    return () => {
      eventSubscriptionClient.unsubscribe();
    };
  }, []);

  return {
    webhookEvents,
    connected,
  };
};