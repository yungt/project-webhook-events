"use client";

import styles from "./Home.module.scss";
import Events from "./events/Events";
import {useEvents} from "./hooks/useEvents";

export default function Home() {

  const {webhookEvents, connected} = useEvents();

  return (
    <main className={styles.home}>

      <div className={styles.header}>
        <div>Subscription status: {connected ? "Connected" : "Disconnected"}</div>
      </div>

      <div className={styles.eventsContainer}>
        <Events events={webhookEvents}/>
      </div>

    </main>
  );
}