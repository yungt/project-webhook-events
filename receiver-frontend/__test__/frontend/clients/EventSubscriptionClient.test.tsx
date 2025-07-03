import {EventHandlers, EventSubscriptionClient} from "../../../frontend/clients/EventSubscriptionClient";

const MOCK_URL = "https://mockUrl";

const mockEventSourceInstance = {
  close: jest.fn(),
  readyState: 1,
  url: "",
  withCredentials: false,
  onopen: null as any,
  onmessage: null as any,
  onerror: null as any,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
};

const MockEventSource = Object.assign(
  jest.fn().mockImplementation(() => mockEventSourceInstance),
  {
    CONNECTING: 0 as const,
    OPEN: 1 as const,
    CLOSED: 2 as const,
    prototype: {} // Simplified prototype
  }
);

(global as any).EventSource = MockEventSource;

describe("EventSubscriptionClient", () => {
  let clientInstance: EventSubscriptionClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEventSourceInstance.onopen = null;
    mockEventSourceInstance.onmessage = null;
    mockEventSourceInstance.onerror = null;

    clientInstance = new EventSubscriptionClient(MOCK_URL);

    clientInstance.unsubscribe();
  });

  describe("subscribe", () => {
    it("should create EventSource when called for the first time", () => {
      const handlers = {
        onOpen: jest.fn(),
        onWebhookEvent: jest.fn(),
        onError: jest.fn()
      };

      clientInstance.subscribe(handlers);

      expect(MockEventSource).toHaveBeenCalledWith(MOCK_URL);
      expect(MockEventSource).toHaveBeenCalledTimes(1);
    });

    it("should not create multiple EventSource instances on subsequent calls", () => {
      const handlers = {onOpen: jest.fn()};

      clientInstance.subscribe(handlers);
      clientInstance.subscribe(handlers);

      expect(MockEventSource).toHaveBeenCalledTimes(1);
    });

    it("should store the provided handlers", () => {
      const handlers = {
        onOpen: jest.fn(),
        onWebhookEvent: jest.fn(),
        onError: jest.fn()
      };

      clientInstance.subscribe(handlers);

      // Test that handlers are called when events are triggered
      expect(mockEventSourceInstance.onopen).toBeDefined();
      (mockEventSourceInstance.onopen as any)();
      expect(handlers.onOpen).toHaveBeenCalledTimes(1);
    });

    it("should setup event listeners on EventSource", () => {
      const handlers = {onOpen: jest.fn()};

      clientInstance.subscribe(handlers);

      expect(mockEventSourceInstance.onopen).toBeDefined();
      expect(mockEventSourceInstance.onmessage).toBeDefined();
      expect(mockEventSourceInstance.onerror).toBeDefined();
    });
  });

  describe("event handlers", () => {
    let handlers: EventHandlers;

    beforeEach(() => {
      handlers = {
        onOpen: jest.fn(),
        onWebhookEvent: jest.fn(),
        onError: jest.fn()
      };
      clientInstance.subscribe(handlers);
    });

    describe("onopen event", () => {
      it("should call onOpen handler when EventSource opens", () => {
        expect(mockEventSourceInstance.onopen).toBeDefined();
        (mockEventSourceInstance.onopen as any)();

        expect(handlers.onOpen).toHaveBeenCalledTimes(1);
        expect(handlers.onOpen).toHaveBeenCalledWith();
      });

      it("should not throw error if onOpen handler is not provided", () => {
        const handlersWithoutOnOpen = {onWebhookEvent: jest.fn()};
        clientInstance.subscribe(handlersWithoutOnOpen);

        expect(() => (mockEventSourceInstance.onopen as any)()).not.toThrow();
      });
    });

    describe("onmessage event", () => {
      it("should call onWebhookEvent handler when receiving webhook message", () => {
        const webhookData = {
          timestamp: "2023-01-01T10:00:00Z",
          id: "1",
          event_type: "test_event_type",
          payload: {actor: "test_actor"}
        };

        const messageEvent = {
          data: JSON.stringify({
            type: "webhook",
            data: webhookData
          })
        };

        (mockEventSourceInstance.onmessage as any)(messageEvent);

        expect(handlers.onWebhookEvent).toHaveBeenCalledTimes(1);
        expect(handlers.onWebhookEvent).toHaveBeenCalledWith(webhookData);
      });

      it("should not call onWebhookEvent handler for non-webhook messages", () => {
        const messageEvent = {
          data: JSON.stringify({
            type: "non-webhook",
            data: {some: "data"}
          })
        };

        (mockEventSourceInstance.onmessage as any)(messageEvent);

        expect(handlers.onWebhookEvent).not.toHaveBeenCalled();
      });

      it("should not throw error if onWebhookEvent handler is not provided", () => {
        const handlersWithoutWebhook = {onOpen: jest.fn()};
        clientInstance.subscribe(handlersWithoutWebhook);

        const messageEvent = {
          data: JSON.stringify({
            type: "webhook",
            data: {some: "data"}
          })
        };

        expect(() => (mockEventSourceInstance.onmessage as any)(messageEvent)).not.toThrow();
      });

      it("should handle malformed JSON gracefully", () => {
        const messageEvent = {
          data: "invalid json"
        };

        expect(() => (mockEventSourceInstance.onmessage as any)(messageEvent)).not.toThrow();
      });
    });

    describe("onerror event", () => {
      it("should call onError handler when EventSource encounters error", () => {
        (mockEventSourceInstance.onerror as any)();

        expect(handlers.onError).toHaveBeenCalledTimes(1);
        expect(handlers.onError).toHaveBeenCalledWith();
      });

      it("should not throw error if onError handler is not provided", () => {
        const handlersWithoutOnError = {onOpen: jest.fn()};
        clientInstance.subscribe(handlersWithoutOnError);

        expect(() => (mockEventSourceInstance.onerror as any)()).not.toThrow();
      });
    });
  });

  describe("unsubscribe", () => {
    it("should close EventSource when unsubscribing", () => {
      const handlers = {onOpen: jest.fn()};
      clientInstance.subscribe(handlers);

      clientInstance.unsubscribe();

      expect(mockEventSourceInstance.close).toHaveBeenCalledTimes(1);
    });

    it("should clear handlers when unsubscribing", () => {
      const handlers = {onOpen: jest.fn()};
      clientInstance.subscribe(handlers);

      clientInstance.unsubscribe();

      // After unsubscribe, calling onopen should not trigger the handler
      (mockEventSourceInstance.onopen as any)();
      expect(handlers.onOpen).not.toHaveBeenCalled();
    });

    it("should set eventSource to null after unsubscribing", () => {
      const handlers = {onOpen: jest.fn()};
      clientInstance.subscribe(handlers);
      clientInstance.unsubscribe();

      // Subscribe again should create a new EventSource
      clientInstance.subscribe(handlers);
      expect(MockEventSource).toHaveBeenCalledTimes(2);
    });

    it("should not throw error when unsubscribing without active subscription", () => {
      expect(() => clientInstance.unsubscribe()).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete subscription lifecycle", () => {
      const handlers = {
        onOpen: jest.fn(),
        onWebhookEvent: jest.fn(),
        onError: jest.fn()
      };

      // Subscribe
      clientInstance.subscribe(handlers);
      expect(MockEventSource).toHaveBeenCalledTimes(1);

      // Simulate connection open
      (mockEventSourceInstance.onopen as any)();
      expect(handlers.onOpen).toHaveBeenCalledTimes(1);

      // Simulate receiving webhook event
      const webhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "test-id",
        event_type: "user_action",
        payload: {actor: "test_user"}
      };

      (mockEventSourceInstance.onmessage as any)({
        data: JSON.stringify({type: "webhook", data: webhookEvent})
      });
      expect(handlers.onWebhookEvent).toHaveBeenCalledWith(webhookEvent);

      // Simulate error
      (mockEventSourceInstance.onerror as any)();
      expect(handlers.onError).toHaveBeenCalledTimes(1);

      // Unsubscribe
      clientInstance.unsubscribe();
      expect(mockEventSourceInstance.close).toHaveBeenCalledTimes(1);
    });

    it("should handle subscription with partial handlers", () => {
      const partialHandlers = {
        onWebhookEvent: jest.fn()
        // onOpen and onError are intentionally omitted
      };

      clientInstance.subscribe(partialHandlers);

      // These should not throw errors
      expect(() => (mockEventSourceInstance.onopen as any)()).not.toThrow();
      expect(() => (mockEventSourceInstance.onerror as any)()).not.toThrow();

      // But webhook events should still work
      (mockEventSourceInstance.onmessage as any)({
        data: JSON.stringify({
          type: "webhook",
          data: {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "test", payload: {actor: "user"}}
        })
      });
      expect(partialHandlers.onWebhookEvent).toHaveBeenCalledTimes(1);
    });
  });
});