import {Table} from "@mantine/core";
import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";

type Props = {
  event: WebhookEvent,
}
export default function Event(props: Props) {

  const {event} = props;

  return (
    <Table.Tr>
      <Table.Td>{event.id}</Table.Td>
      <Table.Td>{event.timestamp}</Table.Td>
      <Table.Td>{event.event_type}</Table.Td>
      <Table.Td>{event.payload.actor}</Table.Td>
    </Table.Tr>
  )
}