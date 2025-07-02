"use client";

import {Table} from "@mantine/core";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Event from "./event/Event";
import {useEffect, useState} from "react";
import {SortTypes} from "../../../frontend/lib/SortTypes";
import styles from "./Events.module.scss";
import IdSortButton from "./sortButtons/id/IdSortButton";
import TimestampSortButton from "./sortButtons/timestamp/TimestampSortButton";

type Props = {
  events: Array<WebhookEvent>,
}

export default function Events(props: Props) {

  const {events} = props;

  const [sortedEvents, setSortedEvents] = useState<Array<WebhookEvent>>(events);

  const [sortType, setSortType] = useState<SortTypes>(SortTypes.TIMESTAMP_DESCENDING);

  const sortedTimestampDescending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  const sortedTimestampAscending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  const sortedIdDescending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => b.id.localeCompare(a.id));
  }
  const sortedIdAscending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => a.id.localeCompare(b.id));
  }

  useEffect(() => {
    console.log("events.count=" + events.length, "sortType=" + sortType);
    if (sortType === SortTypes.TIMESTAMP_DESCENDING) {
      setSortedEvents(sortedTimestampDescending(events));
    } else if (sortType === SortTypes.TIMESTAMP_ASCENDING) {
      setSortedEvents(sortedTimestampAscending(events));
    } else if (sortType === SortTypes.ID_DESCENDING) {
      setSortedEvents(sortedIdDescending(events));
    } else if (sortType === SortTypes.ID_ASCENDING) {
      setSortedEvents(sortedIdAscending(events));
    } else {
      setSortedEvents(sortedTimestampDescending(events));
    }
  }, [events, sortType]);

  return (
    <Table withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <div className={styles.tableHeader}>
              <span>Timestamp</span>
              <TimestampSortButton sortType={sortType} onUpdate={setSortType}/>
            </div>
          </Table.Th>
          <Table.Th>
            <div className={styles.tableHeader}>
              <span>ID</span>
              <IdSortButton sortType={sortType} onUpdate={setSortType}/>
            </div>
          </Table.Th>
          <Table.Th>Event Type</Table.Th>
          <Table.Th>Payload.Actor</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sortedEvents.map((event) => (
          <Event key={event.id} event={event}/>
        ))}
      </Table.Tbody>
    </Table>
  );
}