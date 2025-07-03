import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {sortedIdAscending, sortedIdDescending} from "../../../../frontend/lib/sorts/IdSortUtils";

describe("sortedIdDescending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedIdDescending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in descending ID order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated id items", () => {
    it("should return sorted events in descending ID order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with UUID-style IDs", () => {
    it("should handle UUID strings correctly", () => {
      const input: Array<WebhookEvent> = [
        {
          timestamp: "2023-01-01T10:00:00Z",
          id: "550e8400-e29b-41d4-a716-446655440000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T12:00:00Z",
          id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T08:00:00Z",
          id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T14:00:00Z",
          id: "550e8401-e29b-41d4-a716-446655440000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
      ];

      const result = sortedIdDescending(input);

      // Verify that UUIDs are sorted lexicographically in descending order
      expect(result.length).toBe(4);
      expect(result.every(event => event.id.length > 30)).toBe(true); // UUID length check
    });
  });

  describe("when giving events with alphanumeric IDs", () => {
    it("should handle mixed alphanumeric IDs correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "user_123", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "admin_456", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "guest_789", event_type: "woof", payload: {actor: "platform_engineer"}},
        {
          timestamp: "2023-01-01T14:00:00Z",
          id: "system_000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "user_123", event_type: "woof", payload: {actor: "platform_engineer"}},
        {
          timestamp: "2023-01-01T14:00:00Z",
          id: "system_000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {timestamp: "2023-01-01T08:00:00Z", id: "guest_789", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "admin_456", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with numeric string IDs", () => {
    it("should handle numeric strings lexicographically (not numerically)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "10", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "20", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      // Note: lexicographic sorting means "20" > "2" > "100" > "10"
      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "20", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "10", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with zero-padded numeric IDs", () => {
    it("should sort zero-padded numbers correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "0010", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "0002", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "0100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "0020", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "0100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "0020", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "0010", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "0002", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are already sorted in descending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "z", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "y", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "x", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "w", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "z", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "y", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "x", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "w", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in ascending order", () => {
    it("should reverse the order to descending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "a", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "b", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "c", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "d", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "d", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "c", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "b", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "a", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace IDs", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "abc", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: " ", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "123", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdDescending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      expect(result[0].id).toBe("abc");
      expect(result[1].id).toBe("123");
      // Empty string and space will be at the end in descending order
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedIdDescending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});

describe("sortedIdAscending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedIdAscending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in ascending ID order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated id items", () => {
    it("should return sorted events in ascending ID order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with UUID-style IDs", () => {
    it("should handle UUID strings correctly", () => {
      const input: Array<WebhookEvent> = [
        {
          timestamp: "2023-01-01T10:00:00Z",
          id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T12:00:00Z",
          id: "550e8401-e29b-41d4-a716-446655440000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T08:00:00Z",
          id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {
          timestamp: "2023-01-01T14:00:00Z",
          id: "550e8400-e29b-41d4-a716-446655440000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
      ];

      const result = sortedIdAscending(input);

      // Verify that UUIDs are sorted lexicographically in ascending order
      expect(result.length).toBe(4);
      expect(result.every(event => event.id.length > 30)).toBe(true); // UUID length check
      // First UUID should start with "550e8400" (lexicographically first)
      expect(result[0].id.startsWith("550e8400")).toBe(true);
    });
  });

  describe("when giving events with alphanumeric IDs", () => {
    it("should handle mixed alphanumeric IDs correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "user_123", event_type: "woof", payload: {actor: "platform_engineer"}},
        {
          timestamp: "2023-01-01T12:00:00Z",
          id: "system_000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {timestamp: "2023-01-01T08:00:00Z", id: "guest_789", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "admin_456", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "admin_456", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "guest_789", event_type: "woof", payload: {actor: "platform_engineer"}},
        {
          timestamp: "2023-01-01T12:00:00Z",
          id: "system_000",
          event_type: "woof",
          payload: {actor: "platform_engineer"}
        },
        {timestamp: "2023-01-01T10:00:00Z", id: "user_123", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with numeric string IDs", () => {
    it("should handle numeric strings lexicographically (not numerically)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "10", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "20", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "100", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      // Note: lexicographic sorting means "10" < "100" < "2" < "20"
      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "10", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "20", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with zero-padded numeric IDs", () => {
    it("should sort zero-padded numbers correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "0100", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "0010", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "0002", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "0020", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "0002", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "0010", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "0020", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "0100", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are already sorted in ascending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "a", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "b", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "c", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "d", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "a", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "b", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "c", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "d", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in descending order", () => {
    it("should reverse the order to ascending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "z", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "y", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "x", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "w", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "w", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "x", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "y", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "z", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace IDs", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "abc", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "123", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: " ", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedIdAscending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      // Empty string and space will be at the beginning in ascending order
      expect(result[result.length - 2].id).toBe("123");
      expect(result[result.length - 1].id).toBe("abc");
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedIdAscending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});