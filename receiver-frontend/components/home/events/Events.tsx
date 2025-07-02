"use client";

import {Table} from "@mantine/core";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Event from "./event/Event";
import {useState} from "react";
import {SortTypes} from "../../../frontend/lib/SortTypes";
import styles from "./Events.module.scss";
import IdSortButton from "./sortButtons/id/IdSortButton";
import TimestampSortButton from "./sortButtons/timestamp/TimestampSortButton";

type Props = {
  events: Array<WebhookEvent>,
}

export default function Events(props: Props) {

  const {events} = props;

  const [sortType, setSortType] = useState<SortTypes>(SortTypes.ID_ASCENDING);
  const [activePage, setPage] = useState<number>(1);


  return (
    <Table withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <div className={styles.tableHeader}>
              <span>ID</span>
              <IdSortButton sortType={sortType} onUpdate={setSortType}/>
            </div>
          </Table.Th>
          <Table.Th>
            <div className={styles.tableHeader}>
              <span>Timestamp</span>
              <TimestampSortButton sortType={sortType} onUpdate={setSortType}/>
            </div>
          </Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Payload.Actor</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {events.map((event) => (
          <Event key={event.id} event={event}/>
        ))}
      </Table.Tbody>
    </Table>
  );
}