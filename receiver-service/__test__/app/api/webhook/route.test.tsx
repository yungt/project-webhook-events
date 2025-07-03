import {NextResponse} from "next/server";
import {webhookEventBusService} from "../../../../backend/services/bus/impl/WebhookEventBusService";
import {WebhookEvent} from "../../../../backend/models/WebhookEvent";
import {POST} from "../../../../app/api/webhook/route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

jest.mock("../../../../backend/services/bus/impl/WebhookEventBusService", () => ({
  webhookEventBusService: {
    emitNewEvent: jest.fn(),
  },
}));
const mockWebhookEventBusService = webhookEventBusService as jest.Mocked<typeof webhookEventBusService>;

describe("POST /api/webhook route", () => {
  let mockRequest: Partial<Request>;
  let mockWebhookEvent: WebhookEvent;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebhookEventBusService.emitNewEvent.mockImplementation(() => {
      // default as nothing
    });

    mockWebhookEvent = {
      id: "test-event-123",
      timestamp: "2023-01-01T10:00:00Z",
      event_type: "woof",
      payload: {actor: "platform_engineer"}
    };

    mockRequest = {
      json: jest.fn().mockResolvedValue(mockWebhookEvent),
      headers: new Headers({
        'content-type': 'application/json'
      }),
      method: 'POST',
      url: 'http://localhost:3000/api/webhook'
    };

    mockNextResponse.json.mockReturnValue({
      status: 200,
      json: async () => ({status: 200})
    } as any);
  });

  describe("successful webhook processing", () => {
    it("should process valid webhook event successfully", async () => {
      const response = await POST(mockRequest as Request);

      expect(mockRequest.json).toHaveBeenCalledTimes(1);

      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledWith(mockWebhookEvent);
      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledTimes(1);

      expect(mockNextResponse.json).toHaveBeenCalledWith({status: 200});

      expect(response).toBeDefined();
    });

  });

  describe("error handling", () => {
    it("should handle JSON parsing errors and webhookEventBusService should not be called", async () => {
      const jsonError = new Error("Invalid JSON");
      (mockRequest.json as jest.Mock).mockRejectedValue(jsonError);

      await expect(POST(mockRequest as Request)).rejects.toThrow("Invalid JSON");

      expect(mockWebhookEventBusService.emitNewEvent).not.toHaveBeenCalled();
      expect(mockNextResponse.json).not.toHaveBeenCalled();
    });

    it("should handle malformed webhook events and webhookEventBusService should not be called", async () => {
      const malformedEvent = {
        id: "malformed-event",
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(malformedEvent);

      await POST(mockRequest as Request);

      expect(mockWebhookEventBusService.emitNewEvent).not.toHaveBeenCalled();
      expect(mockNextResponse.json).toHaveBeenCalledWith({status: 400});
    });

    it("should handle null/undefined request body", async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue(null);

      await POST(mockRequest as Request);

      expect(mockNextResponse.json).toHaveBeenCalledWith({status: 400});
    });

    it("should handle empty object as webhook event", async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({});

      await POST(mockRequest as Request);

      expect(mockNextResponse.json).toHaveBeenCalledWith({status: 400});
    });
  });

  describe("request handling", () => {
    it("should call req.json() exactly once", async () => {
      await POST(mockRequest as Request);

      expect(mockRequest.json).toHaveBeenCalledTimes(1);
      expect(mockRequest.json).toHaveBeenCalledWith();
    });

    it("should handle concurrent requests", async () => {
      const event1 = {...mockWebhookEvent, id: "concurrent-1"};
      const event2 = {...mockWebhookEvent, id: "concurrent-2"};

      const request1 = {
        ...mockRequest,
        json: jest.fn().mockResolvedValue(event1)
      } as any;

      const request2 = {
        ...mockRequest,
        json: jest.fn().mockResolvedValue(event2)
      } as any;

      // Process both requests concurrently
      await Promise.all([
        POST(request1),
        POST(request2)
      ]);

      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledTimes(2);
      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenNthCalledWith(1, event1);
      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenNthCalledWith(2, event2);
      expect(mockNextResponse.json).toHaveBeenCalledTimes(2);
    });
  });

  describe("response format", () => {
    it("should return consistent response structure", async () => {
      await POST(mockRequest as Request);

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        status: 200,
      });

      // Verify the response structure
      const callArgs = mockNextResponse.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty('status', 200);
    });
  });

  describe("integration scenarios", () => {
    it("should handle rapid sequential requests", async () => {
      const events = Array.from({length: 10}, (_, i) => ({
        ...mockWebhookEvent,
        id: `rapid-event-${i}`,
        timestamp: new Date(Date.now() + i * 1000).toISOString()
      }));

      for (const event of events) {
        const request = {
          ...mockRequest,
          json: jest.fn().mockResolvedValue(event)
        } as any;

        await POST(request);
      }

      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledTimes(10);
      expect(mockNextResponse.json).toHaveBeenCalledTimes(10);

      // Verify each event was processed
      events.forEach((event, index) => {
        expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenNthCalledWith(index + 1, event);
      });
    });

    it("should maintain isolation between requests", async () => {
      const event1 = {...mockWebhookEvent, id: "isolation-1"};

      // First request succeeds
      const request1 = {
        ...mockRequest,
        json: jest.fn().mockResolvedValue(event1)
      } as any;

      // Second request fails JSON parsing
      const request2 = {
        ...mockRequest,
        json: jest.fn().mockRejectedValue(new Error("Parse error"))
      } as any;

      // Process first request
      await POST(request1);
      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledWith(event1);

      // Process second request (should fail)
      await expect(POST(request2)).rejects.toThrow("Parse error");

      // Verify first request's success wasn't affected by second request's failure
      expect(mockWebhookEventBusService.emitNewEvent).toHaveBeenCalledTimes(1);
      expect(mockNextResponse.json).toHaveBeenCalledTimes(1);
    });
  });
});