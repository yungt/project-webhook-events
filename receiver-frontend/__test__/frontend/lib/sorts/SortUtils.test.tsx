import {sortStrategies} from "../../../../frontend/lib/sorts/SortUtils";
import {SortTypes} from "../../../../frontend/lib/sorts/types/SortTypes";
import {sortedTimestampAscending, sortedTimestampDescending} from "../../../../frontend/lib/sorts/TimestampSortUtils";
import {sortedIdAscending, sortedIdDescending} from "../../../../frontend/lib/sorts/IdSortUtils";
import {sortedEventTypeAscending, sortedEventTypeDescending} from "../../../../frontend/lib/sorts/EventTypeSortUtils";
import {sortedPayloadAscending, sortedPayloadDescending} from "../../../../frontend/lib/sorts/PayloadSortUtils";
import {WebhookEvent} from "../../../../frontend/models/WebhookEvent";

describe("sortStrategies", () => {
  describe("strategy mapping", () => {
    it("should map all SortTypes to corresponding functions", () => {
      expect(sortStrategies[SortTypes.TIMESTAMP_DESCENDING]).toBe(sortedTimestampDescending);
      expect(sortStrategies[SortTypes.TIMESTAMP_ASCENDING]).toBe(sortedTimestampAscending);
      expect(sortStrategies[SortTypes.ID_DESCENDING]).toBe(sortedIdDescending);
      expect(sortStrategies[SortTypes.ID_ASCENDING]).toBe(sortedIdAscending);
      expect(sortStrategies[SortTypes.EVENT_TYPE_DESCENDING]).toBe(sortedEventTypeDescending);
      expect(sortStrategies[SortTypes.EVENT_TYPE_ASCENDING]).toBe(sortedEventTypeAscending);
      expect(sortStrategies[SortTypes.PAYLOAD_DESCENDING]).toBe(sortedPayloadDescending);
      expect(sortStrategies[SortTypes.PAYLOAD_ASCENDING]).toBe(sortedPayloadAscending);
    });

    it("should have exactly 8 strategies mapped", () => {
      const strategyKeys = Object.keys(sortStrategies);
      expect(strategyKeys.length).toBe(8);
    });

    it("should have all enum values covered", () => {
      const enumValues = Object.values(SortTypes).filter(value => typeof value === 'number');

      enumValues.forEach(sortType => {
        expect(sortStrategies[sortType as SortTypes]).toBeDefined();
        expect(typeof sortStrategies[sortType as SortTypes]).toBe('function');
      });
    });
  });

  describe("strategy execution", () => {
    const mockEvents: Array<WebhookEvent> = [
      {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
      {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
    ];

    it("should execute TIMESTAMP_DESCENDING strategy correctly", () => {
      const strategy = sortStrategies[SortTypes.TIMESTAMP_DESCENDING];
      const result = strategy([...mockEvents]);

      expect(result[0].timestamp).toBe("2023-01-01T12:00:00Z");
      expect(result[1].timestamp).toBe("2023-01-01T10:00:00Z");
    });

    it("should execute ID_ASCENDING strategy correctly", () => {
      const strategy = sortStrategies[SortTypes.ID_ASCENDING];
      const result = strategy([...mockEvents]);

      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("should execute all strategies without throwing errors", () => {
      Object.values(SortTypes)
        .filter(value => typeof value === 'number')
        .forEach(sortType => {
          const strategy = sortStrategies[sortType as SortTypes];

          expect(() => {
            strategy([...mockEvents]);
          }).not.toThrow();
        });
    });
  });

  describe("strategy function properties", () => {
    it("should ensure all strategies are functions", () => {
      Object.values(sortStrategies).forEach(strategy => {
        expect(typeof strategy).toBe('function');
        expect(strategy.length).toBe(1); // Should accept 1 parameter (the array)
      });
    });

    it("should ensure strategies return arrays", () => {
      const mockEvents: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      Object.values(sortStrategies).forEach(strategy => {
        const result = strategy([...mockEvents]);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe("dynamic strategy usage", () => {
    it("should work with dynamic sort type selection", () => {
      const mockEvents: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T12:00:00Z", id: "2", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "1", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      // Simulate dynamic sort type selection
      const selectedSortType = SortTypes.TIMESTAMP_DESCENDING;
      const sortFunction = sortStrategies[selectedSortType];
      const result = sortFunction([...mockEvents]);

      expect(result[0].timestamp).toBe("2023-01-01T12:00:00Z");
    });

    it("should handle sorting with different sort types", () => {
      const mockEvents: Array<WebhookEvent> = [
        {timestamp: "2023-01-01T08:00:00Z", id: "3", event_type: "meow", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T12:00:00Z", id: "1", event_type: "bark", payload: {actor: "platform_engineer"}},
        {timestamp: "2023-01-01T10:00:00Z", id: "2", event_type: "woof", payload: {actor: "platform_engineer"}},
      ];

      // Test timestamp descending
      const timestampDesc = sortStrategies[SortTypes.TIMESTAMP_DESCENDING]([...mockEvents]);
      expect(timestampDesc[0].timestamp).toBe("2023-01-01T12:00:00Z");

      // Test ID ascending
      const idAsc = sortStrategies[SortTypes.ID_ASCENDING]([...mockEvents]);
      expect(idAsc[0].id).toBe("1");

      // Test event type ascending (assuming alphabetical sort)
      const eventTypeAsc = sortStrategies[SortTypes.EVENT_TYPE_ASCENDING]([...mockEvents]);
      expect(eventTypeAsc[0].event_type).toBe("bark"); // "bark" comes first alphabetically
    });
  });
});