export interface IEventBusService<T> {
  emitNewEvent(event: T): void;

  onNewEvent(callback: (event: T) => void): void;

  removeNewEventListener(callback: (event: T) => void): void;
}