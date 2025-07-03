import {TextEncoder, TextDecoder} from "util";

// Set up TextEncoder/TextDecoder with type assertion
if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

// Set up ReadableStream mock
if (typeof global.ReadableStream === "undefined") {
  (global as any).ReadableStream = class ReadableStream {
    public locked = false;
    public _controller: any = null;

    constructor(underlyingSource: any = {}) {
      if (underlyingSource.start) {
        this._controller = {
          enqueue: jest.fn(),
          close: jest.fn(),
          error: jest.fn()
        };

        try {
          underlyingSource.start(this._controller);
        } catch (error) {
          console.error("ReadableStream start error:", error);
        }
      }
    }

    getReader() {
      this.locked = true;
      return {
        read: jest.fn().mockResolvedValue({done: true, value: undefined}),
        cancel: jest.fn().mockResolvedValue(undefined),
        releaseLock: jest.fn(() => {
          this.locked = false;
        })
      };
    }

    cancel() {
      return Promise.resolve();
    }
  };
}

// Set up Response mock
if (typeof global.Response === "undefined") {
  (global as any).Response = class Response {
    public body: any;
    public status: number;
    public headers: any;
    public ok: boolean;

    constructor(body: any = null, init: any = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.headers = new (global as any).Headers(init.headers);
      this.ok = this.status >= 200 && this.status < 300;
    }

    async text() {
      return this.body ? String(this.body) : "";
    }

    async json() {
      return JSON.parse(await this.text());
    }
  };
}

// Set up Headers mock
if (typeof global.Headers === "undefined") {
  (global as any).Headers = class Headers {
    private _headers = new Map<string, string>();

    constructor(init?: any) {
      if (init && typeof init === "object") {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), String(value));
        });
      }
    }

    get(name: string): string | null {
      return this._headers.get(name.toLowerCase()) || null;
    }

    set(name: string, value: string): void {
      this._headers.set(name.toLowerCase(), String(value));
    }

    has(name: string): boolean {
      return this._headers.has(name.toLowerCase());
    }

    delete(name: string): void {
      this._headers.delete(name.toLowerCase());
    }

    append(name: string, value: string): void {
      const existing = this.get(name);
      this.set(name, existing ? `${existing}, ${value}` : value);
    }

    entries() {
      return this._headers.entries();
    }

    keys() {
      return this._headers.keys();
    }

    values() {
      return this._headers.values();
    }

    forEach(callback: any, thisArg?: any) {
      this._headers.forEach(callback, thisArg);
    }
  };
}

export {};