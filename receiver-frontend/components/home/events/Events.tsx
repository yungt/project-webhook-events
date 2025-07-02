"use client";

import {Pagination, Table} from "@mantine/core";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Event from "./event/Event";
import {useEffect, useState} from "react";
import {SortTypes} from "../../../frontend/lib/SortTypes";
import styles from "./Events.module.scss";
import SortButton from "./sortButton/SortButton";

const COUNT_PER_PAGE = 10;

type Props = {
  events: Array<WebhookEvent>,
}

export default function Events(props: Props) {

  const {events} = props;

  const [sortedEvents, setSortedEvents] = useState<Array<WebhookEvent>>(events);
  const [currentPageEvents, setCurrentPageEvents] = useState<Array<WebhookEvent>>([]);

  const [sortType, setSortType] = useState<SortTypes>(SortTypes.TIMESTAMP_DESCENDING);

  const [activePage, setPage] = useState<number>(1);

  const getPaginatedEvents = (input: Array<WebhookEvent>, page: number) => {
    const startIndex = (page - 1) * COUNT_PER_PAGE;
    const endIndex = startIndex + COUNT_PER_PAGE;
    return input.slice(startIndex, endIndex);
  }

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
    setCurrentPageEvents(getPaginatedEvents(sortedEvents, activePage));
  }, [sortedEvents, activePage]);

  useEffect(() => {
    console.log("events.count=" + events.length, "sortType=" + sortType);
    let newSortedEvents: Array<WebhookEvent>;
    if (sortType === SortTypes.TIMESTAMP_DESCENDING) {
      newSortedEvents = sortedTimestampDescending(events);
    } else if (sortType === SortTypes.TIMESTAMP_ASCENDING) {
      newSortedEvents = sortedTimestampAscending(events);
    } else if (sortType === SortTypes.ID_DESCENDING) {
      newSortedEvents = sortedIdDescending(events);
    } else if (sortType === SortTypes.ID_ASCENDING) {
      newSortedEvents = sortedIdAscending(events);
    } else {
      newSortedEvents = sortedTimestampDescending(events);
    }

    setSortedEvents(newSortedEvents);
    setCurrentPageEvents(getPaginatedEvents(newSortedEvents, activePage));

  }, [events, sortType, activePage]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.total}>Events ({sortedEvents.length})</div>
        <Pagination
          size={"sm"}
          total={Math.ceil(sortedEvents.length / COUNT_PER_PAGE)}
          value={activePage}
          onChange={setPage}
        />
      </div>

      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <div className={styles.tableHeader}>
                <span>Timestamp</span>
                <SortButton
                  sortType={sortType}
                  ascendingType={SortTypes.TIMESTAMP_ASCENDING}
                  descendingType={SortTypes.TIMESTAMP_DESCENDING}
                  onUpdate={setSortType}
                />
              </div>
            </Table.Th>
            <Table.Th>
              <div className={styles.tableHeader}>
                <span>ID</span>
                <SortButton
                  sortType={sortType}
                  ascendingType={SortTypes.ID_ASCENDING}
                  descendingType={SortTypes.ID_DESCENDING}
                  onUpdate={setSortType}
                />
              </div>
            </Table.Th>
            <Table.Th>
              <div className={styles.tableHeader}>
                <span>Event Type</span>
                <SortButton
                  sortType={sortType}
                  ascendingType={SortTypes.EVENT_TYPE_ASCENDING}
                  descendingType={SortTypes.EVENT_TYPE_DESCENDING}
                  onUpdate={setSortType}
                />
              </div>
            </Table.Th>
            <Table.Th>
              <div className={styles.tableHeader}>
                <span>Payload.Actor</span>
                <SortButton
                  sortType={sortType}
                  ascendingType={SortTypes.PAYLOAD_ASCENDING}
                  descendingType={SortTypes.PAYLOAD_DESCENDING}
                  onUpdate={setSortType}
                />
              </div>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {currentPageEvents.map((event) => (
            <Event key={event.id} event={event}/>
          ))}
        </Table.Tbody>

      </Table>

    </>
  );
}