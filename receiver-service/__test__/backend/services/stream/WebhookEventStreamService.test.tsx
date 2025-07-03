import {webhookEventBusService,} from "../../../../backend/services/bus/impl/WebhookEventBusService";
import {webhookEventStreamService} from "../../../../backend/services/stream/impl/WebhookEventStreamService";

jest.mock("../../../../backend/services/bus/impl/WebhookEventBusService", () => ({
  webhookEventBusService: {
    onNewEvent: jest.fn(),
    removeNewEventListener: jest.fn(),
  },
}));
const mockWebhookEventBusService = webhookEventBusService as jest.Mocked<typeof webhookEventBusService>;

const mockReadableStreamConstructor = jest.fn();
global.ReadableStream = mockReadableStreamConstructor;

jest.useFakeTimers();

describe("WebhookEventStreamService", () => {
  let mockController: any;
  let registeredEventHandler: any;
  let capturedStartFunction: any;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockController = {
      enqueue: jest.fn(),
      close: jest.fn(),
      error: jest.fn(),
    };

    mockReadableStreamConstructor.mockImplementation((config) => {
      capturedStartFunction = config.start;
      return {
        getReader: jest.fn(),
        cancel: jest.fn(),
        locked: false,
      };
    });

    mockWebhookEventBusService.onNewEvent.mockImplementation((handler) => {
      registeredEventHandler = handler;
    });

  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("getCustomReadable", () => {

    it("should return a ReadableStream", () => {
      const stream = webhookEventStreamService.getCustomReadable();
      expect(mockReadableStreamConstructor).toHaveBeenCalled();
      expect(stream).toBeDefined();
    });

    it("should register event listener with webhookEventBusService", () => {
      webhookEventStreamService.getCustomReadable();

      // Execute the captured start function
      capturedStartFunction(mockController);

      expect(mockWebhookEventBusService.onNewEvent).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should setup heartbeat interval", () => {
      webhookEventStreamService.getCustomReadable();
      capturedStartFunction(mockController);

      expect(mockController.enqueue).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(30000);
      expect(mockController.enqueue).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(30000);
      expect(mockController.enqueue).toHaveBeenCalledTimes(3);
    });
  });

  describe("webhook event handling", () => {
    beforeEach(() => {
      webhookEventStreamService.getCustomReadable();
      capturedStartFunction(mockController);
    });

    it("should handle new webhook events", () => {
      const mockWebhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "test-event-123",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      // Simulate webhook event
      registeredEventHandler(mockWebhookEvent);

      expect(mockController.enqueue).toHaveBeenCalledTimes(2); // Initial + webhook event
    });

    it("should handle controller.enqueue errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Make enqueue throw an error
      mockController.enqueue.mockImplementationOnce(() => {
        throw new Error("Stream closed");
      });

      const mockWebhookEvent = {
        timestamp: "2023-01-01T10:00:00Z",
        id: "test-event-123",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      };

      registeredEventHandler(mockWebhookEvent);

      expect(consoleSpy).toHaveBeenCalledWith("Stream closed, removing listener");
      expect(mockWebhookEventBusService.removeNewEventListener).toHaveBeenCalledWith(
        registeredEventHandler
      );

      consoleSpy.mockRestore();
    });
  });

  describe("cleanup functionality", () => {
    it("should return cleanup function from start", () => {
      webhookEventStreamService.getCustomReadable();

      const cleanup = capturedStartFunction(mockController);

      expect(typeof cleanup).toBe("function");
    });

    it("should cleanup interval and listeners when cleanup is called", () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      webhookEventStreamService.getCustomReadable();
      const cleanup = capturedStartFunction(mockController);

      cleanup();

      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(mockWebhookEventBusService.removeNewEventListener).toHaveBeenCalledWith(
        registeredEventHandler
      );
      expect(mockController.close).toHaveBeenCalled();
    });
  });

  describe("service instance", () => {
    it("should export a singleton instance", () => {
      expect(webhookEventStreamService).toBeDefined();
      expect(typeof webhookEventStreamService.getCustomReadable).toBe("function");
    });

    it("should return different ReadableStream instances on multiple calls", () => {
      const stream1 = webhookEventStreamService.getCustomReadable();
      const stream2 = webhookEventStreamService.getCustomReadable();

      // Test that they are different objects
      expect(stream1).not.toBe(stream2);

      // Test that both are truthy/defined
      expect(stream1).toBeDefined();
      expect(stream2).toBeDefined();

      // Test that ReadableStream constructor was called twice
      expect(mockReadableStreamConstructor).toHaveBeenCalledTimes(2);
    });
  });
});