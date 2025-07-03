import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {sortedPayloadAscending, sortedPayloadDescending} from "../../../../frontend/lib/sorts/PayloadSortUtils";

describe("sortedPayloadDescending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedPayloadDescending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in descending payload.actor order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated payload.actor items", () => {
    it("should return sorted events in descending payload.actor order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "charlie"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "alice"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}}
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}}
      ]);
    });
  });

  describe("when giving events with different actor types", () => {
    it("should handle various actor name formats", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_123"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "admin"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "system"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "guest_456"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_123"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "system"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "guest_456"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "admin"}},
      ]);
    });
  });

  describe("when giving events with email-style actors", () => {
    it("should handle email addresses as actors", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "bob@company.com"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice@company.com"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie@company.com"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "admin@company.com"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie@company.com"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "bob@company.com"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice@company.com"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "admin@company.com"}},
      ]);
    });
  });

  describe("when giving events with case sensitivity in actors", () => {
    it("should handle case-sensitive sorting correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "Bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "CHARLIE"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
      ];

      const result = sortedPayloadDescending(input);

      // localeCompare handles case sensitivity
      expect(result.length).toBe(4);
      expect(result[0].payload.actor).toBe("david");
      expect(result[result.length - 1].payload.actor).toBe("alice");
    });
  });

  describe("when giving events with numeric actor identifiers", () => {
    it("should handle numeric string actors lexicographically", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_10"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user_2"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user_100"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user_20"}},
      ];

      const result = sortedPayloadDescending(input);

      // Lexicographic descending: user_2 > user_20 > user_100 > user_10
      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user_20"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user_2"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user_100"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_10"}},
      ]);
    });
  });

  describe("when giving events that are already sorted in descending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "zoe"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "yuki"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "xavier"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "zoe"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "yuki"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "xavier"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice"}},
      ]);
    });
  });

  describe("when giving events that are sorted in ascending order", () => {
    it("should reverse the order to descending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
      ];

      const result = sortedPayloadDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace actors", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: ""}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: " "}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
      ];

      const result = sortedPayloadDescending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      expect(result[0].payload.actor).toBe("bob");
      expect(result[1].payload.actor).toBe("alice");
      // Empty string and space will be at the end in descending order
    });
  });

  describe("when giving events with special characters in actors", () => {
    it("should handle special characters correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user-123"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user_456"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user.789"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user@abc"}},
      ];

      const result = sortedPayloadDescending(input);

      // Verify that special characters are handled by localeCompare
      expect(result.length).toBe(4);
      expect(result.every(event => event.payload.actor)).toBe(true);
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedPayloadDescending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
      ]);
    });
  });
});

describe("sortedPayloadAscending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedPayloadAscending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in ascending payload.actor order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "david"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated payload.actor items", () => {
    it("should return sorted events in ascending payload.actor order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "alice"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}}
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}}
      ]);
    });
  });

  describe("when giving events with different actor types", () => {
    it("should handle various actor name formats", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_123"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "system"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "guest_456"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "admin"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "admin"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "guest_456"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "system"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_123"}},
      ]);
    });
  });

  describe("when giving events with email-style actors", () => {
    it("should handle email addresses as actors", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie@company.com"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob@company.com"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "admin@company.com"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice@company.com"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "admin@company.com"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice@company.com"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob@company.com"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie@company.com"}},
      ]);
    });
  });

  describe("when giving events with case sensitivity in actors", () => {
    it("should handle case-sensitive sorting correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "Bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "CHARLIE"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice"}},
      ];

      const result = sortedPayloadAscending(input);

      // localeCompare handles case sensitivity
      expect(result.length).toBe(4);
      expect(result[0].payload.actor).toBe("alice");
      expect(result[result.length - 1].payload.actor).toBe("david");
    });
  });

  describe("when giving events with numeric actor identifiers", () => {
    it("should handle numeric string actors lexicographically", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_2"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user_10"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user_20"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user_100"}},
      ];

      const result = sortedPayloadAscending(input);

      // Lexicographic ascending: user_10 < user_100 < user_2 < user_20
      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user_10"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user_100"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user_2"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user_20"}},
      ]);
    });
  });

  describe("when giving events that are already sorted in ascending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "david"}},
      ]);
    });
  });

  describe("when giving events that are sorted in descending order", () => {
    it("should reverse the order to ascending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "zoe"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice"}},
      ];

      const result = sortedPayloadAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "david"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "zoe"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace actors", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: " "}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: ""}},
      ];

      const result = sortedPayloadAscending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      // Empty string and space will be at the beginning in ascending order
      expect(result[result.length - 2].payload.actor).toBe("alice");
      expect(result[result.length - 1].payload.actor).toBe("bob");
    });
  });

  describe("when giving events with special characters in actors", () => {
    it("should handle special characters correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "user@abc"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "user.789"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "user_456"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "user-123"}},
      ];

      const result = sortedPayloadAscending(input);

      // Verify that special characters are handled by localeCompare
      expect(result.length).toBe(4);
      expect(result.every(event => event.payload.actor)).toBe(true);
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedPayloadAscending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "alice"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "bob"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "charlie"}},
      ]);
    });
  });
});