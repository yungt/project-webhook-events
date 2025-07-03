import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Events from "../../../../components/home/events/Events";
import {SortTypes} from "../../../../frontend/lib/sorts/types/SortTypes";
import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {useSortedPaginateEvents} from "@components/home/events/hooks/useSortedPaginateEvents";

jest.mock("@mantine/core", () => {
  const Table = ({children, withTableBorder, withColumnBorders, ...props}: any) => (
    <table data-testid="table" {...props}>{children}</table>
  );

  Table.Thead = ({children}: any) => (
    <thead data-testid="tableTHead">{children}</thead>
  );

  Table.Tbody = ({children}: any) => (
    <tbody data-testid="tableTBody">{children}</tbody>
  );

  Table.Tr = ({children}: any) => (
    <tr data-testid="tableTR">{children}</tr>
  );

  Table.Th = ({children}: any) => (
    <th data-testid="tableTH">{children}</th>
  );

  Table.Td = ({children}: any) => (
    <th data-testid="tableTD">{children}</th>
  );

  return {
    Pagination: ({total, value, onChange, size}: any) => (
      <div data-testid="pagination">
        <span data-testid="paginationTotal">{total}</span>
        <span data-testid="paginationValue">{value}</span>
        <button
          data-testid="paginationButtonNext"
          onClick={() => onChange(value + 1)}
        >
          Next
        </button>
      </div>
    ),
    Table,
    Button: ({children, onClick, ...props}: any) => (
      <button data-testid="mantineButton" onClick={onClick} {...props}>
        {children}
      </button>
    ),
  };
});

jest.mock("../../../../components/home/events/hooks/useSortedPaginateEvents", () => ({
  useSortedPaginateEvents: jest.fn(),
  COUNT_PER_PAGE: 10,
}));
const mockUseSortedPaginateEvents = useSortedPaginateEvents as jest.MockedFunction<typeof useSortedPaginateEvents>;

jest.mock("@components/home/events/Events.module.scss", () => ({
  header: "header-class",
  total: "total-class",
  tableHeader: "table-header-class",
}));

jest.mock("../../../../components/home/events/sortButton/SortButton", () => {
  return function MockSortButton({sortType, ascendingType, descendingType, onUpdate}: any) {
    return (
      <button
        data-testid={`sortButton-${ascendingType}-${descendingType}`}
        onClick={() => onUpdate(ascendingType)}
      >
        Sort {ascendingType}/{descendingType}
      </button>
    );
  };
});

jest.mock("../../../../components/home/events/event/Event", () => {
  return function MockEvent({event}: { event: any }) {
    return (
      <tr data-testid={`event-${event.id}`}>
        <td>{event.id}</td>
        <td>{event.event_type}</td>
        <td>{event.timestamp}</td>
      </tr>
    );
  };
});

describe("Events Component", () => {

  const mockEvents: Array<WebhookEvent> = [
    {
      timestamp: "2023-01-01T10:00:00Z",
      id: "1",
      event_type: "woof",
      payload: {actor: "platform_engineer"}
    },
    {
      timestamp: "2023-01-01T11:00:00Z",
      id: "2",
      event_type: "bark",
      payload: {actor: "data_engineer"}
    },
    {
      timestamp: "2023-01-01T12:00:00Z",
      id: "3",
      event_type: "meow",
      payload: {actor: "qa_engineer"}
    }
  ];

  const mockHookReturnValue = {
    sortedEvents: mockEvents,
    currentPageEvents: mockEvents.slice(0, 2),
    activePage: 1,
    setPage: jest.fn(),
    sortType: SortTypes.TIMESTAMP_DESCENDING,
    setSortType: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSortedPaginateEvents.mockReturnValue(mockHookReturnValue);
  });

  describe("title includes event count", () => {
    it("should display total number of events", () => {

      render(<Events events={mockEvents}/>);

      expect(screen.getByLabelText("Title")).toHaveTextContent("Events (3)");
    });

    it("should display zero events when empty", () => {
      mockUseSortedPaginateEvents.mockReturnValue({
        ...mockHookReturnValue,
        sortedEvents: [],
        currentPageEvents: [],
      });

      render(<Events events={[]}/>);

      expect(screen.getByLabelText("Title")).toHaveTextContent("Events (0)");
    });
  });

  describe("pagination", () => {
    it("should render Pagination component with correct props", () => {
      render(<Events events={mockEvents}/>);

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toBeInTheDocument();

      // Math.ceil(3 / 10) = 1
      expect(screen.getByTestId("paginationTotal")).toHaveTextContent("1");
      expect(screen.getByTestId("paginationValue")).toHaveTextContent("1");
    });

    it("should calculate correct total pages", () => {
      const manyEvents = Array.from({length: 25}, (_, i) => ({
        ...mockEvents[0],
        id: `${i + 1}`,
      }));

      mockUseSortedPaginateEvents.mockReturnValue({
        ...mockHookReturnValue,
        sortedEvents: manyEvents,
      });

      render(<Events events={manyEvents}/>);

      // Math.ceil(25 / 10) = 3
      expect(screen.getByTestId("paginationTotal")).toHaveTextContent("3");
    });

    it("should call setPage when pagination changes", () => {
      const mockSetPage = jest.fn();
      mockUseSortedPaginateEvents.mockReturnValue({
        ...mockHookReturnValue,
        setPage: mockSetPage,
      });

      render(<Events events={mockEvents}/>);

      fireEvent.click(screen.getByTestId("paginationButtonNext"));

      expect(mockSetPage).toHaveBeenCalledWith(2); // activePage + 1
    });
  });

  describe("event table", () => {
    it("should render table with table head and table body", () => {
      render(<Events events={mockEvents}/>);

      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByTestId("tableTHead")).toBeInTheDocument();
      expect(screen.getByTestId("tableTBody")).toBeInTheDocument();
    });

    it("should render table headers for each column", () => {
      render(<Events events={mockEvents}/>);

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Timestamp")).toBeInTheDocument();
      expect(screen.getByText("Event Type")).toBeInTheDocument();
      expect(screen.getByText("Payload.Actor")).toBeInTheDocument();
    });

    it("should render sort buttons for each column", () => {
      render(<Events events={mockEvents}/>);

      expect(screen.getByTestId(`sortButton-${SortTypes.ID_ASCENDING}-${SortTypes.ID_DESCENDING}`)).toBeInTheDocument();
      expect(screen.getByTestId(`sortButton-${SortTypes.TIMESTAMP_ASCENDING}-${SortTypes.TIMESTAMP_DESCENDING}`)).toBeInTheDocument();
      expect(screen.getByTestId(`sortButton-${SortTypes.EVENT_TYPE_ASCENDING}-${SortTypes.EVENT_TYPE_DESCENDING}`)).toBeInTheDocument();
      expect(screen.getByTestId(`sortButton-${SortTypes.PAYLOAD_ASCENDING}-${SortTypes.PAYLOAD_DESCENDING}`)).toBeInTheDocument();
    });
  });

  describe("event rendering", () => {
    it("should render events from currentPageEvents", () => {
      render(<Events events={mockEvents}/>);

      // Should render first 2 events (from currentPageEvents mock)
      expect(screen.getByTestId("event-1")).toBeInTheDocument();
      expect(screen.getByTestId("event-2")).toBeInTheDocument();
      expect(screen.queryByTestId("event-3")).not.toBeInTheDocument();
    });

    it("should render empty table body when no current page events", () => {
      mockUseSortedPaginateEvents.mockReturnValue({
        ...mockHookReturnValue,
        currentPageEvents: [],
      });

      render(<Events events={mockEvents}/>);

      const tbody = screen.getByTestId("tableTBody");
      expect(tbody).toBeInTheDocument();
      expect(tbody.children).toHaveLength(0);
    });
  });

  describe("sorting functionality", () => {
    it("should pass correct props to SortButton components", () => {
      const mockSetSortType = jest.fn();
      mockUseSortedPaginateEvents.mockReturnValue({
        ...mockHookReturnValue,
        setSortType: mockSetSortType,
        sortType: SortTypes.ID_DESCENDING,
      });

      render(<Events events={mockEvents}/>);

      const sortButton = screen.getByTestId(`sortButton-${SortTypes.ID_ASCENDING}-${SortTypes.ID_DESCENDING}`);

      fireEvent.click(sortButton);

      expect(mockSetSortType).toHaveBeenCalledWith(SortTypes.ID_ASCENDING);
    });

  });

  describe("useSortedPaginateEvents hook", () => {
    it("should call with the proper events input", () => {
      render(<Events events={mockEvents}/>);

      expect(mockUseSortedPaginateEvents).toHaveBeenCalledWith({
        events: mockEvents,
      });
    });

  });

  describe("styles", () => {
    it("should apply correct CSS classes", () => {
      const {container} = render(<Events events={mockEvents}/>);

      expect(container.querySelector(".header-class")).toBeInTheDocument();
      expect(container.querySelector(".total-class")).toBeInTheDocument();
      expect(container.querySelector(".table-header-class")).toBeInTheDocument();
    });

  });

});