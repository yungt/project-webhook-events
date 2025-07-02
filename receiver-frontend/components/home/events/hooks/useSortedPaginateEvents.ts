import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {useEffect, useState} from "react";
import {SortTypes} from "../../../../frontend/lib/SortTypes";

export const COUNT_PER_PAGE = 10;

type Props = {
  events: Array<WebhookEvent>,
}

export const useSortedPaginateEvents = (props: Props) => {

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

  // There is nothing to sort for eventType and payload since we filtered to only accept event_type "woof",
  // and payload.actor "platform_engineering"
  // Currently we are filter on payload.actor, but we can configure to sort on the whole payload data instead.
  const sortedEventTypeDescending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => b.event_type.localeCompare(a.event_type));
  }
  const sortedEventTypeAscending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => a.event_type.localeCompare(b.event_type));
  }
  const sortedPayloadDescending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => b.payload.actor.localeCompare(a.payload.actor));
  }
  const sortedPayloadAscending = (input: Array<WebhookEvent>) => {
    return input.sort((a, b) => a.payload.actor.localeCompare(b.payload.actor));
  }

  useEffect(() => {
    setCurrentPageEvents(getPaginatedEvents(sortedEvents, activePage));
  }, [sortedEvents, activePage]);

  const sortStrategies = {
    [SortTypes.TIMESTAMP_DESCENDING]: sortedTimestampDescending,
    [SortTypes.TIMESTAMP_ASCENDING]: sortedTimestampAscending,
    [SortTypes.ID_DESCENDING]: sortedIdDescending,
    [SortTypes.ID_ASCENDING]: sortedIdAscending,
    [SortTypes.EVENT_TYPE_DESCENDING]: sortedEventTypeDescending,
    [SortTypes.EVENT_TYPE_ASCENDING]: sortedEventTypeAscending,
    [SortTypes.PAYLOAD_DESCENDING]: sortedPayloadDescending,
    [SortTypes.PAYLOAD_ASCENDING]: sortedPayloadAscending,
  } as const;

  useEffect(() => {
    console.log("events.count=" + events.length, "sortType=" + sortType);

    const sortFunction = sortStrategies[sortType] || sortedTimestampDescending;
    const newSortedEvents = sortFunction(events);

    setSortedEvents(newSortedEvents);
    setCurrentPageEvents(getPaginatedEvents(newSortedEvents, activePage));

  }, [events, sortType, activePage]);

  return {
    sortedEvents,
    currentPageEvents,
    activePage,
    setPage,
    sortType,
    setSortType,
  }

}