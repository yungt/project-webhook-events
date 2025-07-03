import {SortTypes} from "./types/SortTypes";
import {sortedTimestampAscending, sortedTimestampDescending} from "./TimestampSortUtils";
import {sortedIdAscending, sortedIdDescending} from "./IdSortUtils";
import {sortedEventTypeAscending, sortedEventTypeDescending} from "./EventTypeSortUtils";
import {sortedPayloadAscending, sortedPayloadDescending} from "./PayloadSortUtils";

export const sortStrategies = {
  [SortTypes.TIMESTAMP_DESCENDING]: sortedTimestampDescending,
  [SortTypes.TIMESTAMP_ASCENDING]: sortedTimestampAscending,
  [SortTypes.ID_DESCENDING]: sortedIdDescending,
  [SortTypes.ID_ASCENDING]: sortedIdAscending,
  [SortTypes.EVENT_TYPE_DESCENDING]: sortedEventTypeDescending,
  [SortTypes.EVENT_TYPE_ASCENDING]: sortedEventTypeAscending,
  [SortTypes.PAYLOAD_DESCENDING]: sortedPayloadDescending,
  [SortTypes.PAYLOAD_ASCENDING]: sortedPayloadAscending,
} as const;