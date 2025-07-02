"use client";

import {Pagination, Table} from "@mantine/core";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Event from "./event/Event";
import {SortTypes} from "../../../frontend/lib/SortTypes";
import styles from "./Events.module.scss";
import SortButton from "./sortButton/SortButton";
import {COUNT_PER_PAGE, useSortedPaginateEvents} from "./hooks/useSortedPaginateEvents";

type Props = {
  events: Array<WebhookEvent>,
}

export default function Events(props: Props) {

  const {events} = props;

  const {
    sortedEvents,
    currentPageEvents,
    activePage,
    setPage,
    sortType,
    setSortType,
  } = useSortedPaginateEvents({events});

  return (
    <div>
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

    </div>
  );
}