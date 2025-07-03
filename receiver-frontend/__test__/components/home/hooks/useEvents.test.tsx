import {act, renderHook} from "@testing-library/react";
import {useEvents} from "@components/home/hooks/useEvents";
import {eventSubscriptionClient} from "../../../../frontend/clients/EventSubscriptionClient";

jest.mock("../../../../frontend/clients/EventSubscriptionClient", () => ({
  eventSubscriptionClient: {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  },
}));
const mockEventSubscriptionClient = eventSubscriptionClient as jest.Mocked<typeof eventSubscriptionClient>;

describe("useEvents", () => {
  let mockHandlers: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEventSubscriptionClient.subscribe.mockImplementation((handlers: any) => {
      mockHandlers = handlers;
    });
  });

  describe("initial state", () => {
    it("should initialize with empty webhookEvents and connected false", () => {
      const {result} = renderHook(() => useEvents());

      expect(result.current.webhookEvents).toEqual([]);
      expect(result.current.connected).toBe(false);
    });

    it("should subscribe to eventSubscriptionClient on mount", () => {
      renderHook(() => useEvents());

      expect(mockEventSubscriptionClient.subscribe).toHaveBeenCalledTimes(1);
      expect(mockEventSubscriptionClient.subscribe).toHaveBeenCalledWith({
        onOpen: expect.any(Function),
        onWebhookEvent: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  describe("connection handling", () => {
    it("should set connected to true when onOpen is called", () => {
      const {result} = renderHook(() => useEvents());

      act(() => {
        mockHandlers.onOpen();
      });

      expect(result.current.connected).toBe(true);
    });

    it("should set connected to false when onError is called", () => {
      const {result} = renderHook(() => useEvents());

      act(() => {
        mockHandlers.onOpen();
      });
      expect(result.current.connected).toBe(true);

      // simulate error
      act(() => {
        mockHandlers.onError();
      });
      expect(result.current.connected).toBe(false);
    });
  });

  describe("webhook event handling", () => {
    it("should add webhook event when it matches criteria", () => {
      const {result} = renderHook(() => useEvents());

      const validWebhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(validWebhookEvent);
      });

      expect(result.current.webhookEvents).toEqual([validWebhookEvent]);
    });

    it("should not add webhook event with wrong event_type", () => {
      const {result} = renderHook(() => useEvents());

      const invalidWebhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "bark",
        payload: {actor: "platform_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(invalidWebhookEvent);
      });

      expect(result.current.webhookEvents).toEqual([]);
    });

    it("should not add webhook event with wrong actor", () => {
      const {result} = renderHook(() => useEvents());

      const invalidWebhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "different_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(invalidWebhookEvent);
      });

      expect(result.current.webhookEvents).toEqual([]);
    });

    it("should accumulate multiple valid webhook events", () => {
      const {result} = renderHook(() => useEvents());

      const webhookEvent1 = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      const webhookEvent2 = {
        timestamp: "2023-01-01T11:00:00Z",
        id: "2",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(webhookEvent1);
      });

      act(() => {
        mockHandlers.onWebhookEvent(webhookEvent2);
      });

      expect(result.current.webhookEvents).toEqual([webhookEvent1, webhookEvent2]);
    });

    it("should filter out invalid events while keeping valid ones", () => {
      const {result} = renderHook(() => useEvents());

      const validEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      const invalidEvent = {
        timestamp: "2023-01-01T11:00:00Z",
        id: "2",
        event_type: "bark",
        payload: {actor: "platform_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(validEvent);
      });

      act(() => {
        mockHandlers.onWebhookEvent(invalidEvent);
      });

      act(() => {
        mockHandlers.onWebhookEvent(validEvent);
      });

      expect(result.current.webhookEvents).toEqual([validEvent, validEvent]);
    });
  });

  describe("cleanup", () => {
    it("should unsubscribe when component unmounts", () => {
      const {unmount} = renderHook(() => useEvents());

      expect(mockEventSubscriptionClient.unsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockEventSubscriptionClient.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("should unsubscribe only once even with multiple unmounts", () => {
      const {unmount} = renderHook(() => useEvents());

      unmount();
      expect(mockEventSubscriptionClient.unsubscribe).toHaveBeenCalledTimes(1);

      // Subsequent calls shouldn't increase the count
      unmount();
      expect(mockEventSubscriptionClient.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete workflow: connect, receive events, disconnect", () => {
      const {result} = renderHook(() => useEvents());

      // Initially disconnected
      expect(result.current.connected).toBe(false);
      expect(result.current.webhookEvents).toEqual([]);

      // Connect
      act(() => {
        mockHandlers.onOpen();
      });
      expect(result.current.connected).toBe(true);

      // Receive valid events
      const webhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      act(() => {
        mockHandlers.onWebhookEvent(webhookEvent);
      });
      expect(result.current.webhookEvents).toEqual([webhookEvent]);

      // Error/disconnect
      act(() => {
        mockHandlers.onError();
      });
      expect(result.current.connected).toBe(false);
      // Events should still be there
      expect(result.current.webhookEvents).toEqual([webhookEvent]);
    });
  });
});