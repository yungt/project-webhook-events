import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Event from "@components/home/events/event/Event";
import {WebhookEvent} from "../../../../../frontend/models/WebhookEvent";

jest.mock("@mantine/core", () => {
  const Table = ({children, ...props}: any) => (
    <table data-testid="table" {...props}>{children}</table>
  );

  Table.Tr = ({children, ...props}: any) => (
    <tr data-testid="tableTR" {...props}>{children}</tr>
  );

  Table.Td = ({children, ...props}: any) => (
    <td data-testid="tableTD" {...props}>{children}</td>
  );

  return {Table};
});

const renderInTable = (event: WebhookEvent) => {
  return render(
    <table>
      <tbody>
      <Event event={event}/>
      </tbody>
    </table>
  );
};

describe("Event Component", () => {
  const mockEvent = {
    timestamp: "2023-01-01T10:00:00Z",
    id: "test-event-123",
    event_type: "woof",
    payload: {actor: "platform_engineer"}
  };

  describe("event row", () => {
    it("should display timestamp", () => {
      renderInTable(mockEvent);

      expect(screen.getByText("2023-01-01T10:00:00Z")).toBeInTheDocument();
    });

    it("should display ID", () => {
      renderInTable(mockEvent);

      expect(screen.getByText("test-event-123")).toBeInTheDocument();
    });

    it("should display event type", () => {
      renderInTable(mockEvent);

      expect(screen.getByText("woof")).toBeInTheDocument();
    });

    it("should display actor value from payload", () => {
      renderInTable(mockEvent);

      expect(screen.getByText("platform_engineer")).toBeInTheDocument();
    });
  });


});