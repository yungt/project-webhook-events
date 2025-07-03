const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "";

import {webhookEventStreamService} from "../../../../backend/services/stream/impl/WebhookEventStreamService";
import {GET, OPTIONS} from "../../../../app/api/events/route";

jest.mock("../../../../backend/services/stream/impl/WebhookEventStreamService", () => ({
  webhookEventStreamService: {
    getCustomReadable: jest.fn(),
  },
}));
const mockWebhookEventStreamService = webhookEventStreamService as jest.Mocked<typeof webhookEventStreamService>;

describe("SSE (server sent events) Route (/api/events/stream)", () => {
  let mockReadableStream: ReadableStream;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReadableStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode('data: {"message": "test"}\n\n'));
        controller.close();
      }
    });
    mockWebhookEventStreamService.getCustomReadable.mockReturnValue(mockReadableStream);
  });

  describe("OPTIONS endpoint", () => {
    it("should return 200 status with CORS headers", async () => {

      const response = await OPTIONS();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.body).toBeNull();

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(ALLOW_ORIGIN);
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('*');
    });

    it("should return proper CORS preflight response structure", async () => {
      const response = await OPTIONS();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.body).toBeNull();

      const headers = ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'];
      headers.forEach(header => {
        expect(response.headers.has(header)).toBe(true);
      });
    });
  });

  describe("GET endpoint", () => {
    it("should return SSE stream with proper headers", async () => {

      const response = await GET();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.body).toBe(mockReadableStream);

      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
      expect(response.headers.get('Connection')).toBe('keep-alive');
      expect(response.headers.get('X-Accel-Buffering')).toBe('no');

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(ALLOW_ORIGIN);
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('*');
    });

    it("should call webhookEventStreamService.getCustomReadable", async () => {
      await GET();

      expect(mockWebhookEventStreamService.getCustomReadable).toHaveBeenCalledTimes(1);
      expect(mockWebhookEventStreamService.getCustomReadable).toHaveBeenCalledWith();
    });

    it("should return the stream from service as response body", async () => {
      const customStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"custom": "stream"}\n\n'));
          controller.close();
        }
      });

      mockWebhookEventStreamService.getCustomReadable.mockReturnValue(customStream);

      const response = await GET();

      expect(response.body).toBe(customStream);
      expect(response.body).not.toBe(mockReadableStream); // Should be the new stream
    });

    it("should return different streams on multiple calls", async () => {
      const stream1 = new ReadableStream();
      const stream2 = new ReadableStream();

      mockWebhookEventStreamService.getCustomReadable
        .mockReturnValueOnce(stream1)
        .mockReturnValueOnce(stream2);

      const response1 = await GET();
      const response2 = await GET();

      expect(response1.body).toBe(stream1);
      expect(response2.body).toBe(stream2);
      expect(response1.body).not.toBe(response2.body);
      expect(mockWebhookEventStreamService.getCustomReadable).toHaveBeenCalledTimes(2);
    });
  });

  describe("error handling", () => {
    it("should handle service errors gracefully", async () => {
      const serviceError = new Error("Stream service failure");
      mockWebhookEventStreamService.getCustomReadable.mockImplementation(() => {
        throw serviceError;
      });

      await expect(GET()).rejects.toThrow("Stream service failure");

      expect(mockWebhookEventStreamService.getCustomReadable).toHaveBeenCalledTimes(1);
    });

    it("should handle service returning null/undefined", async () => {
      mockWebhookEventStreamService.getCustomReadable.mockReturnValue(null as any);

      const response = await GET();

      expect(response.body).toBeNull();
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    });

    it("should handle service returning non-stream object", async () => {
      const notAStream = {fake: "stream"} as any;
      mockWebhookEventStreamService.getCustomReadable.mockReturnValue(notAStream);

      const response = await GET();

      expect(response.body).toBe(notAStream);
      expect(response.status).toBe(200);
    });
  });

  describe("response structure validation", () => {
    it("should return valid Response objects", async () => {
      const optionsResponse = await OPTIONS();
      const getResponse = await GET();

      expect(optionsResponse).toBeInstanceOf(Response);
      expect(getResponse).toBeInstanceOf(Response);

      // OPTIONS should return null body
      expect(optionsResponse.body).toBeNull();

      // GET should return response body
      expect(getResponse.body).toBeTruthy();
    });

  });

  describe("concurrent request handling", () => {
    it("should handle multiple simultaneous GET requests", async () => {
      const streams = [
        new ReadableStream(),
        new ReadableStream(),
        new ReadableStream()
      ];

      mockWebhookEventStreamService.getCustomReadable
        .mockReturnValueOnce(streams[0])
        .mockReturnValueOnce(streams[1])
        .mockReturnValueOnce(streams[2]);

      const responses = await Promise.all([
        GET(),
        GET(),
        GET()
      ]);

      expect(responses).toHaveLength(3);
      expect(responses[0].body).toBe(streams[0]);
      expect(responses[1].body).toBe(streams[1]);
      expect(responses[2].body).toBe(streams[2]);

      expect(mockWebhookEventStreamService.getCustomReadable).toHaveBeenCalledTimes(3);
    });
  });

  describe("headers", () => {
    it("should maintain header case sensitivity", async () => {
      const response = await GET();

      // Headers should be exactly as specified (case matters for some proxies)
      expect(response.headers.get('content-type')).toBe('text/event-stream');
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('cache-control')).toBe('no-cache');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
    });
  });
});