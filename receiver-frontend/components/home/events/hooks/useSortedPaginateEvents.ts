import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {useEffect, useState} from "react";
import {SortTypes} from "../../../../frontend/lib/SortTypes";
import {sortedTimestampDescending, sortStrategies} from "../../../../frontend/lib/SortUtils";

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

  useEffect(() => {
    setCurrentPageEvents(getPaginatedEvents(sortedEvents, activePage));
  }, [sortedEvents, activePage]);

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