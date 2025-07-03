import "@testing-library/jest-dom";
import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {sortedTimestampAscending, sortedTimestampDescending} from "../../../../frontend/lib/sorts/TimestampSortUtils";

describe("sortedTimestampDescending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedTimestampDescending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated timestamp items", () => {
    it("should return sorted events", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with different timestamp formats", () => {
    it("should handle various valid date formats", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00.000Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00+00:00", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result[0]).toEqual({
        timestamp: "2023-01-01T14:00:00",
        id: "4",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[1]).toEqual({
        timestamp: "2023-01-01T12:00:00.000Z",
        id: "2",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[2]).toEqual({
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[3]).toEqual({
        timestamp: "2023-01-01T08:00:00+00:00",
        id: "3",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
    });
  });

  describe("when giving events with millisecond precision", () => {
    it("should sort by millisecond differences", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00.500Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.100Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.900Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.200Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00.900Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.500Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.200Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.100Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events across different time zones", () => {
    it("should sort correctly by UTC time", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00-05:00", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}, // 15:00 UTC
        {timestamp: "2023-01-01T12:00:00+02:00", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}}, // 10:00 UTC
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},      // 08:00 UTC
        {timestamp: "2023-01-01T20:00:00+08:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}}, // 12:00 UTC
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00-05:00", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}, // 15:00 UTC (latest)
        {timestamp: "2023-01-01T20:00:00+08:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}}, // 12:00 UTC
        {timestamp: "2023-01-01T12:00:00+02:00", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}}, // 10:00 UTC
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},      // 08:00 UTC (earliest)
      ]);
    });
  });

  describe("when giving events that are already sorted in descending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in ascending order", () => {
    it("should reverse the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedTimestampDescending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});

describe("sortedTimestampAscending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedTimestampAscending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in ascending order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated timestamp items", () => {
    it("should return sorted events in ascending order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with different timestamp formats", () => {
    it("should handle various valid date formats", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T14:00:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00.000Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00+00:00", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result[0]).toEqual({
        timestamp: "2023-01-01T08:00:00+00:00",
        id: "3",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[1]).toEqual({
        timestamp: "2023-01-01T10:00:00Z",
        id: "1",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[2]).toEqual({
        timestamp: "2023-01-01T12:00:00.000Z",
        id: "2",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
      expect(result[3]).toEqual({
        timestamp: "2023-01-01T14:00:00",
        id: "4",
        event_type: "woof",
        payload: {actor: "platform_engineer"}
      });
    });
  });

  describe("when giving events with millisecond precision", () => {
    it("should sort by millisecond differences in ascending order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00.900Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.200Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.500Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.100Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00.100Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.200Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.500Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00.900Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events across different time zones", () => {
    it("should sort correctly by UTC time in ascending order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00-05:00", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}, // 15:00 UTC
        {timestamp: "2023-01-01T20:00:00+08:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}}, // 12:00 UTC
        {timestamp: "2023-01-01T12:00:00+02:00", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}}, // 10:00 UTC
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},      // 08:00 UTC
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},      // 08:00 UTC (earliest)
        {timestamp: "2023-01-01T12:00:00+02:00", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}}, // 10:00 UTC
        {timestamp: "2023-01-01T20:00:00+08:00", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}}, // 12:00 UTC
        {timestamp: "2023-01-01T10:00:00-05:00", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}, // 15:00 UTC (latest)
      ]);
    });
  });

  describe("when giving events that are already sorted in ascending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in descending order", () => {
    it("should reverse the order to ascending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedTimestampAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedTimestampAscending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});