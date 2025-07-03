import {EventEmitter} from "events";
import {WebhookEvent} from "../../../../backend/models/WebhookEvent";
import {
  webhookEventBusService,
  WebhookEventBusService
} from "../../../../backend/services/bus/impl/WebhookEventBusService";

describe("WebhookEventBusService", () => {
  let service: WebhookEventBusService;
  let mockCallback: jest.MockedFunction<(webhookEvent: WebhookEvent) => void>;
  let mockWebhookEvent: WebhookEvent;

  beforeEach(() => {
    service = new WebhookEventBusService();
    mockCallback = jest.fn();

    mockWebhookEvent = {
      id: "test-event-123",
      timestamp: "2023-01-01T10:00:00Z",
      event_type: "woof",
      payload: {actor: "platform_engineer"}
    };
  });

  afterEach(() => {
    // clean up all listeners to prevent memory leaks
    service.removeAllListeners();
    jest.clearAllMocks();
  });

  describe("class structure", () => {
    it("should extend EventEmitter", () => {
      expect(service).toBeInstanceOf(EventEmitter);
    });

    it("should implement IEventBusService interface methods", () => {
      expect(typeof service.emitNewEvent).toBe("function");
      expect(typeof service.onNewEvent).toBe("function");
      expect(typeof service.removeNewEventListener).toBe("function");
    });
  });

  describe("singleton pattern", () => {
    it("should return the same instance when calling getInstance multiple times", () => {
      const instance1 = WebhookEventBusService.getInstance();
      const instance2 = WebhookEventBusService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(WebhookEventBusService);
    });

    it("should export the singleton instance", () => {
      expect(webhookEventBusService).toBeInstanceOf(WebhookEventBusService);
      expect(webhookEventBusService).toBe(WebhookEventBusService.getInstance());
    });
  });

  describe("event emission", () => {
    it("should emit webhook event when emitNewEvent is called", () => {
      const emitSpy = jest.spyOn(service, 'emit');

      service.emitNewEvent(mockWebhookEvent);

      expect(emitSpy).toHaveBeenCalledWith("webhook", mockWebhookEvent);
      expect(emitSpy).toHaveBeenCalledTimes(1);

      emitSpy.mockRestore();
    });

    it("should trigger registered listeners when emitting events", () => {
      service.onNewEvent(mockCallback);

      service.emitNewEvent(mockWebhookEvent);

      expect(mockCallback).toHaveBeenCalledWith(mockWebhookEvent);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple events", () => {
      service.onNewEvent(mockCallback);

      const event1 = {...mockWebhookEvent, id: "event-1"};
      const event2 = {...mockWebhookEvent, id: "event-2"};

      service.emitNewEvent(event1);
      service.emitNewEvent(event2);

      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenNthCalledWith(1, event1);
      expect(mockCallback).toHaveBeenNthCalledWith(2, event2);
    });
  });

  describe("event listener registration", () => {
    it("should register event listeners with onNewEvent", () => {
      const onSpy = jest.spyOn(service, 'on');

      service.onNewEvent(mockCallback);

      expect(onSpy).toHaveBeenCalledWith("webhook", mockCallback);
      expect(onSpy).toHaveBeenCalledTimes(1);

      onSpy.mockRestore();
    });

    it("should support multiple listeners", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      service.onNewEvent(callback1);
      service.onNewEvent(callback2);

      service.emitNewEvent(mockWebhookEvent);

      expect(callback1).toHaveBeenCalledWith(mockWebhookEvent);
      expect(callback2).toHaveBeenCalledWith(mockWebhookEvent);
    });

    it("should maintain separate listener contexts", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      service.onNewEvent(callback1);
      service.onNewEvent(callback2);

      // Remove only one listener
      service.removeNewEventListener(callback1);

      service.emitNewEvent(mockWebhookEvent);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith(mockWebhookEvent);
    });
  });

  describe("event listener removal", () => {
    it("should remove event listeners with removeNewEventListener", () => {
      const removeListenerSpy = jest.spyOn(service, 'removeListener');

      service.onNewEvent(mockCallback);
      service.removeNewEventListener(mockCallback);

      expect(removeListenerSpy).toHaveBeenCalledWith("webhook", mockCallback);
      expect(removeListenerSpy).toHaveBeenCalledTimes(1);

      removeListenerSpy.mockRestore();
    });

    it("should not trigger removed listeners", () => {
      service.onNewEvent(mockCallback);
      service.removeNewEventListener(mockCallback);

      service.emitNewEvent(mockWebhookEvent);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it("should handle removal of non-existent listeners gracefully", () => {
      const nonExistentCallback = jest.fn();

      // Should not throw an error
      expect(() => {
        service.removeNewEventListener(nonExistentCallback);
      }).not.toThrow();
    });

    it("should only remove the specific listener function", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      service.onNewEvent(callback1);
      service.onNewEvent(callback2);

      // Remove only callback1
      service.removeNewEventListener(callback1);

      service.emitNewEvent(mockWebhookEvent);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith(mockWebhookEvent);
    });
  });

  describe("error handling", () => {

    it("should handle malformed webhook events", () => {
      const malformedEvent = {} as WebhookEvent;

      service.onNewEvent(mockCallback);

      expect(() => {
        service.emitNewEvent(malformedEvent);
      }).not.toThrow();

      expect(mockCallback).toHaveBeenCalledWith(malformedEvent);
    });
  });

  describe("memory management", () => {
    it("should not have memory leaks with multiple add/remove cycles", () => {
      const callback = jest.fn();

      // add and remove listeners multiple times
      for (let i = 0; i < 10; i++) {
        service.onNewEvent(callback);
        service.removeNewEventListener(callback);
      }

      // should have no listeners
      expect(service.listenerCount("webhook")).toBe(0);

      // Emit event - callback should not be called
      service.emitNewEvent(mockWebhookEvent);
      expect(callback).not.toHaveBeenCalled();
    });

    it("should track listener count correctly", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      expect(service.listenerCount("webhook")).toBe(0);

      service.onNewEvent(callback1);
      expect(service.listenerCount("webhook")).toBe(1);

      service.onNewEvent(callback2);
      expect(service.listenerCount("webhook")).toBe(2);

      service.removeNewEventListener(callback1);
      expect(service.listenerCount("webhook")).toBe(1);

      service.removeNewEventListener(callback2);
      expect(service.listenerCount("webhook")).toBe(0);
    });
  });

  describe("integration scenarios", () => {
    it("should handle rapid event emission", () => {
      service.onNewEvent(mockCallback);

      // Emit many events rapidly
      const events = Array.from({length: 100}, (_, i) => ({
        ...mockWebhookEvent,
        id: `event-${i}`
      }));

      events.forEach(event => service.emitNewEvent(event));

      expect(mockCallback).toHaveBeenCalledTimes(100);
    });

    it("should support event listener chaining patterns", () => {
      const results: string[] = [];

      const listener1 = (event: WebhookEvent) => {
        results.push(`listener1-${event.id}`);
      };

      const listener2 = (event: WebhookEvent) => {
        results.push(`listener2-${event.id}`);
      };

      service.onNewEvent(listener1);
      service.onNewEvent(listener2);

      service.emitNewEvent(mockWebhookEvent);

      expect(results).toEqual([
        `listener1-${mockWebhookEvent.id}`,
        `listener2-${mockWebhookEvent.id}`
      ]);
    });
  });
});