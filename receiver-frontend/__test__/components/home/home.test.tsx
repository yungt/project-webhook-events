import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {WebhookEvent} from "../../../frontend/models/WebhookEvent";
import Home from "../../../components/home/Home";
import {useEvents} from "@components/home/hooks/useEvents";

jest.mock("../../../components/home/hooks/useEvents", () => ({
  useEvents: jest.fn(),
}));
const mockUseEvents = useEvents as jest.MockedFunction<typeof useEvents>;

jest.mock("../../../components/home/events/Events", () => {
  return function MockEvents({events}: { events: WebhookEvent[] }) {
    return (
      <div data-testid="events-component">
        <span data-testid="events-count">{events.length}</span>
        {events.map((event, index) => (
          <div key={index} data-testid={`event-${index}`}>
            {event.id}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("../../../components/home/Home.module.scss", () => ({
  home: "home-class",
  header: "header-class",
  eventsContainer: "events-container-class",
}));

describe("Home Component", () => {
  const mockWebhookEvents = [
    {
      timestamp: "2023-01-01T10:00:00Z",
      id: "1",
      event_type: "woof",
      payload: {actor: "platform_engineer"}
    },
    {
      timestamp: "2023-01-01T11:00:00Z",
      id: "2",
      event_type: "woof",
      payload: {actor: "platform_engineer"}
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("connection status display", () => {
    it("should show Connected when connected is true", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: true,
      });

      render(<Home/>);

      expect(screen.getByText(/Subscription status: Connected/)).toBeInTheDocument();
    });

    it("should show Disconnected when connected is false", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      render(<Home/>);

      expect(screen.getByText(/Subscription status: Disconnected/)).toBeInTheDocument();
    });
  });

  describe("events handling", () => {
    it("should pass webhookEvents to Events component", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: mockWebhookEvents,
        connected: true,
      });

      render(<Home/>);

      const eventsComponent = screen.getByTestId("events-component");
      expect(eventsComponent).toBeInTheDocument();

      // Check that the correct number of events is passed
      expect(screen.getByTestId("events-count")).toHaveTextContent("2");

      // Check that specific events are rendered
      expect(screen.getByTestId("event-0")).toHaveTextContent("1");
      expect(screen.getByTestId("event-1")).toHaveTextContent("2");
    });

    it("should handle empty webhookEvents array", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: true,
      });

      render(<Home/>);

      const eventsComponent = screen.getByTestId("events-component");
      expect(eventsComponent).toBeInTheDocument();
      expect(screen.getByTestId("events-count")).toHaveTextContent("0");
    });
  });

  describe("component structure", () => {
    it("should render main container with correct class", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      const {container} = render(<Home/>);

      const mainElement = container.querySelector("main");
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass("home-class");
    });

    it("should render header section with correct class", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      const {container} = render(<Home/>);

      const headerElement = container.querySelector(".header-class");
      expect(headerElement).toBeInTheDocument();
    });

    it("should render events container with correct class", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      const {container} = render(<Home/>);

      const eventsContainer = container.querySelector(".events-container-class");
      expect(eventsContainer).toBeInTheDocument();
    });
  });

  describe("useEvents hook integration", () => {
    it("should call useEvents hook", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      render(<Home/>);

      expect(mockUseEvents).toHaveBeenCalledTimes(1);
      expect(mockUseEvents).toHaveBeenCalledWith();
    });

    it("should handle different hook return values", () => {
      const testCases = [
        {webhookEvents: [], connected: true},
        {webhookEvents: [], connected: false},
        {webhookEvents: mockWebhookEvents, connected: true},
        {webhookEvents: mockWebhookEvents, connected: false},
      ];

      testCases.forEach(({webhookEvents, connected}) => {
        mockUseEvents.mockReturnValue({webhookEvents, connected});

        const {unmount} = render(<Home/>);

        // Check connection status
        const expectedStatus = connected ? "Connected" : "Disconnected";
        expect(screen.getByText(new RegExp(`Subscription status: ${expectedStatus}`))).toBeInTheDocument();

        // Check events count
        expect(screen.getByTestId("events-count")).toHaveTextContent(webhookEvents.length.toString());

        unmount();
      });
    });
  });

  describe("required elements", () => {
    it("should have main element", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: false,
      });

      render(<Home/>);

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("should have status text", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: [],
        connected: true,
      });

      render(<Home/>);

      const statusText = screen.getByText(/Subscription status:/);
      expect(statusText).toBeInTheDocument();
      expect(statusText.textContent).toMatch(/Connected|Disconnected/);
    });
  });

  describe("component data display", () => {
    it("should render events component", () => {
      mockUseEvents.mockReturnValue({
        webhookEvents: mockWebhookEvents,
        connected: true,
      });

      render(<Home/>);

      expect(screen.getByTestId("events-component")).toBeInTheDocument();
    });
  });
});