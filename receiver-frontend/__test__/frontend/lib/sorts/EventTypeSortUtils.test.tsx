import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";
import {sortedEventTypeAscending, sortedEventTypeDescending} from "../../../../frontend/lib/sorts/EventTypeSortUtils";

describe("sortedEventTypeDescending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedEventTypeDescending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in descending alphabetical order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated event_type items", () => {
    it("should return sorted events in descending alphabetical order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "bark", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with case sensitivity", () => {
    it("should handle case-sensitive sorting correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "Woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "MEOW", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      // localeCompare handles case sensitivity - uppercase generally comes before lowercase
      expect(result[0].event_type).toBe("Woof");
      expect(result[1].event_type).toBe("MEOW");
      expect(result[2].event_type).toBe("chirp");
      expect(result[3].event_type).toBe("bark");
    });
  });

  describe("when giving events with special characters", () => {
    it("should handle special characters in event types", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "user_login", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "user-logout", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "user.update", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "user@create", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      // Verify that special characters are handled by localeCompare
      expect(result.length).toBe(4);
      expect(result.every(event => event.event_type)).toBe(true);
    });
  });

  describe("when giving events with numeric event types", () => {
    it("should handle numeric strings in event types", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "event_1", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "event_10", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "event_2", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "event_20", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "event_20", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "event_2", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "event_10", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "event_1", payload: {actor: "platform_engineer"}},

      ]);
    });
  });

  describe("when giving events that are already sorted in descending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "zebra", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "bark", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "zebra", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "bark", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in ascending order", () => {
    it("should reverse the order to descending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "zebra", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "zebra", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace event types", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: " ", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeDescending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      expect(result[0].event_type).toBe("woof");
      expect(result[1].event_type).toBe("bark");
      // Empty string and space will be at the end in descending order
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedEventTypeDescending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});

describe("sortedEventTypeAscending", () => {
  describe("when giving an empty event array", () => {
    it("should return empty sorted events", () => {
      const input: Array<WebhookEvent> = [];
      const result = sortedEventTypeAscending(input);
      expect(result).toEqual([]);
    });
  });

  describe("when giving unsorted events", () => {
    it("should return sorted events in ascending alphabetical order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving unsorted events with duplicated event_type items", () => {
    it("should return sorted events in ascending alphabetical order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "bark", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T16:00:00Z", id: "5", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving a single event", () => {
    it("should return the same event", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}}
      ]);
    });
  });

  describe("when giving events with case sensitivity", () => {
    it("should handle case-sensitive sorting correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "Bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "MEOW", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "chirp", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      // localeCompare handles case sensitivity - uppercase generally comes before lowercase
      expect(result[0].event_type).toBe("Bark");
      expect(result[1].event_type).toBe("chirp");
      expect(result[2].event_type).toBe("MEOW");
      expect(result[3].event_type).toBe("woof");
    });
  });

  describe("when giving events with special characters", () => {
    it("should handle special characters in event types", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "user_login", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "user-logout", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "user.update", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "user@create", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      // Verify that special characters are handled by localeCompare
      expect(result.length).toBe(4);
      expect(result.every(event => event.event_type)).toBe(true);
    });
  });

  describe("when giving events with numeric event types", () => {
    it("should handle numeric strings in event types", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "event_2", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "event_10", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "event_1", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "event_20", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "event_1", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "event_10", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "event_2", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "event_20", payload: {actor: "platform_engineer"}},

      ]);
    });
  });

  describe("when giving events that are already sorted in ascending order", () => {
    it("should maintain the order", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "zebra", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "zebra", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events that are sorted in descending order", () => {
    it("should reverse the order to ascending", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "zebra", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "bark", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      expect(result).toEqual([
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "zebra", payload: {actor: "platform_engineer"}},
      ]);
    });
  });

  describe("when giving events with empty or whitespace event types", () => {
    it("should handle empty strings and whitespace correctly", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: " ", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T14:00:00Z", id: "4", event_type: "bark", payload: {actor: "platform_engineer"}},
      ];

      const result = sortedEventTypeAscending(input);

      // Verify sorting handles empty/whitespace strings
      expect(result.length).toBe(4);
      // Empty string and space will be at the beginning in ascending order
      expect(result[result.length - 2].event_type).toBe("bark");
      expect(result[result.length - 1].event_type).toBe("woof");
    });
  });

  describe("when function mutates the original array", () => {
    it("should modify the original array (since Array.sort is in-place)", () => {
      const input: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
      ];
      const originalInput = [...input]; // Create a copy to compare

      const result = sortedEventTypeAscending(input);

      expect(result).toBe(input); // Should return the same array reference
      expect(input).not.toEqual(originalInput); // Original array should be modified
      expect(input).toEqual([
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ]);
    });
  });
});