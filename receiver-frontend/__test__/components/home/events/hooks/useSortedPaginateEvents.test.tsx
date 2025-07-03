import {act, renderHook} from "@testing-library/react";
import {COUNT_PER_PAGE, useSortedPaginateEvents} from "@components/home/events/hooks/useSortedPaginateEvents";
import {SortTypes} from "../../../../../frontend/lib/sorts/types/SortTypes";

describe("useSortedPaginateEvents", () => {

  const mockEvents = [
    {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "type1", payload: {actor: "engineer1"}},
    {timestamp: "2023-01-01T11:00:00Z", id: "2", event_type: "type2", payload: {actor: "engineer2"}},
    {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "type3", payload: {actor: "engineer3"}},
    {timestamp: "2023-01-01T13:00:00Z", id: "4", event_type: "type4", payload: {actor: "engineer4"}},
    {timestamp: "2023-01-01T14:00:00Z", id: "5", event_type: "type5", payload: {actor: "engineer5"}},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("init", () => {
    it("should initialize with correct default values", () => {
      const {result} = renderHook(() => useSortedPaginateEvents({events: mockEvents}));

      expect(result.current.activePage).toBe(1);
      expect(result.current.sortType).toBe(SortTypes.TIMESTAMP_DESCENDING);
      expect(result.current.sortedEvents).toHaveLength(mockEvents.length);
      expect(result.current.currentPageEvents).toHaveLength(Math.min(COUNT_PER_PAGE, mockEvents.length));
    })
  });

  describe("sorting", () => {

    it("should update sort when setSortType is called", () => {
      const {result} = renderHook(() => useSortedPaginateEvents({events: mockEvents}));

      act(() => {
        result.current.setSortType(SortTypes.ID_ASCENDING);
      });

      expect(result.current.sortType).toBe(SortTypes.ID_ASCENDING);

      // Test actual sorting result
      const sortedEvents = result.current.sortedEvents;
      expect(sortedEvents[0].id <= sortedEvents[1].id).toBe(true);
    });

    it("should re-sort when events change", () => {
      const newEvents = [
        {timestamp: "2023-01-01T15:00:00Z", id: "6", event_type: "new", payload: {actor: "engineer6"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "7", event_type: "newer", payload: {actor: "engineer7"}},
      ];

      const {result, rerender} = renderHook(
        ({events}) => useSortedPaginateEvents({events}),
        {initialProps: {events: mockEvents}}
      );

      const originalCount = result.current.sortedEvents.length;

      rerender({events: newEvents});

      expect(result.current.sortedEvents).toHaveLength(newEvents.length);
      expect(result.current.sortedEvents.length).not.toBe(originalCount);
    });


  });

  describe("pagination", () => {
    it("should paginate correctly for first page", () => {
      const {result} = renderHook(() => useSortedPaginateEvents({events: mockEvents}));

      expect(result.current.currentPageEvents).toHaveLength(Math.min(COUNT_PER_PAGE, mockEvents.length));
      expect(result.current.activePage).toBe(1);
    });

    it("should update page when setPage is called", () => {
      // Create more events to test pagination
      const manyEvents = Array.from({length: 25}, (_, i) => ({
        timestamp: `2023-01-01T${10 + i}:00:00Z`,
        id: `${i + 1}`,
        event_type: "test",
        payload: {actor: `user${i + 1}`}
      }));

      const {result} = renderHook(() => useSortedPaginateEvents({events: manyEvents}));

      act(() => {
        result.current.setPage(2);
      });

      expect(result.current.activePage).toBe(2);
      expect(result.current.currentPageEvents).toHaveLength(COUNT_PER_PAGE);
    });

    it("should have proper current page count", () => {
      // Create 15 events
      const fifteenEvents = Array.from({length: 15}, (_, i) => ({
        timestamp: `2023-01-01T${10 + i}:00:00Z`,
        id: `${i + 1}`,
        event_type: "test",
        payload: {actor: `user${i + 1}`}
      }));

      const {result} = renderHook(() => useSortedPaginateEvents({events: fifteenEvents}));

      // Page 1 should have 10 events
      expect(result.current.currentPageEvents).toHaveLength(10);

      act(() => {
        result.current.setPage(2);
      });

      // Page 2 should have 5 events (15 - 10)
      expect(result.current.currentPageEvents).toHaveLength(5);
    });

    it("should handle pagination with fewer events than page size", () => {
      const fewEvents = mockEvents.slice(0, 3);
      const {result} = renderHook(() => useSortedPaginateEvents({events: fewEvents}));

      expect(result.current.currentPageEvents).toHaveLength(3);
      expect(result.current.activePage).toBe(1);
    });
  });


});