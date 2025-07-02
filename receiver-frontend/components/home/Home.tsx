"use client";

import styles from "./Home.module.scss";
import {useEffect, useState} from "react";
import {WebhookEvent} from "../../frontend/models/WebhookEvent";
import Events from "./events/Events";

const EVENT_URL = "http://localhost:3001/api/events";

export default function Home() {

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(EVENT_URL);

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "webhook") {
        const webhookEvent: WebhookEvent = data.data;
        if (webhookEvent.event_type === "woof" && webhookEvent.payload.actor === "platform_engineer") {
          setWebhookEvents(prev => [...prev, webhookEvent]);
        }
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
    }

  }, []);

  return (
    <main className={styles.home}>

      <div className={styles.header}>
        <div>Receiver Frontend - Webhook Events</div>
        <div>Event subscription: {connected ? 'Connected' : 'Disconnected'}</div>
        <div>Total items: {webhookEvents.length}</div>

        <div className={styles.body}>
          <Events events={webhookEvents}/>
        </div>
      </div>

    </main>
  );
}