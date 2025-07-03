import {SortTypes} from "../../lib/sorts/types/SortTypes";

export type ColumnHeader = {
  title: string,
  ascendingType: SortTypes,
  descendingType: SortTypes,
}
export const COLUMN_HEADERS: Array<ColumnHeader> = [
  {
    title: "Timestamp",
    ascendingType: SortTypes.TIMESTAMP_ASCENDING,
    descendingType: SortTypes.TIMESTAMP_DESCENDING,
  },
  {
    title: "ID",
    ascendingType: SortTypes.ID_ASCENDING,
    descendingType: SortTypes.ID_DESCENDING,
  },
  {
    title: "Event Type",
    ascendingType: SortTypes.EVENT_TYPE_ASCENDING,
    descendingType: SortTypes.EVENT_TYPE_DESCENDING,
  },
  {
    title: "Payload.Actor",
    ascendingType: SortTypes.PAYLOAD_ASCENDING,
    descendingType: SortTypes.PAYLOAD_DESCENDING,
  },
];