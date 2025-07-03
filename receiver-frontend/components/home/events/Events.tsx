"use client";

import {Pagination, Table} from "@mantine/core";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Event from "./event/Event";
import styles from "./Events.module.scss";
import SortButton from "./sortButton/SortButton";
import {COUNT_PER_PAGE, useSortedPaginateEvents} from "./hooks/useSortedPaginateEvents";
import {COLUMN_HEADERS} from "../../../frontend/home/events/ColumnHeaders";

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
        <div aria-label={"Title"} className={styles.total}>Events ({sortedEvents.length})</div>
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

            {COLUMN_HEADERS.map((columnHeader) => (
              <Table.Th key={columnHeader.title}>
                <div className={styles.tableHeader}>
                  <span>{columnHeader.title}</span>
                  <SortButton
                    sortType={sortType}
                    ascendingType={columnHeader.ascendingType}
                    descendingType={columnHeader.descendingType}
                    onUpdate={setSortType}
                  />
                </div>
              </Table.Th>
            ))}

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