import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia — provide a stub
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom doesn't implement IntersectionObserver
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  // @ts-expect-error augmenting window for tests
  window.IntersectionObserver = IntersectionObserverStub;
}

// Stub ResizeObserver for CodeMirror tests
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error augmenting window for tests
  window.ResizeObserver = ResizeObserverStub;
}

// Stub Web Worker for Pyodide hook tests
if (typeof window !== 'undefined' && !('Worker' in window)) {
  // @ts-expect-error augmenting window for tests
  window.Worker = class {
    constructor() {}
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
    onmessage = null;
    onerror = null;
  };
}

// Clear localStorage between tests
beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
});