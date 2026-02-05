import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWebGLCanvas, clearWebGLSupportCache } from '../useWebGLCanvas';

describe('useWebGLCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearWebGLSupportCache();

    // Default mock for WebGL support
    vi.stubGlobal(
      'WebGLRenderingContext',
      vi.fn(() => ({}))
    );

    HTMLCanvasElement.prototype.getContext = vi.fn(
      (contextId: string) => {
        if (contextId === 'webgl' || contextId === 'experimental-webgl') {
          return {}; // Return truthy object to indicate support
        }
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns isSupported: true when WebGL is available', () => {
    const { result } = renderHook(() => useWebGLCanvas());

    expect(result.current.isSupported).toBe(true);
  });

  it('returns isSupported: false when WebGL is not available', () => {
    // Override mock to simulate no WebGL support
    vi.stubGlobal('WebGLRenderingContext', undefined);
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    clearWebGLSupportCache();

    const { result } = renderHook(() => useWebGLCanvas());

    expect(result.current.isSupported).toBe(false);
  });

  it('returns hasError: false initially', () => {
    const { result } = renderHook(() => useWebGLCanvas());

    expect(result.current.hasError).toBe(false);
    expect(result.current.contextLost).toBe(false);
  });

  it('sets hasError to true on webglcontextlost event', () => {
    const { result } = renderHook(() => useWebGLCanvas());

    const event = new Event('webglcontextlost');
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.contextLost).toBe(true);
  });

  it('sets hasError to false on webglcontextrestored event', () => {
    const { result } = renderHook(() => useWebGLCanvas());

    // First trigger context lost
    const lostEvent = new Event('webglcontextlost');
    Object.defineProperty(lostEvent, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(lostEvent);
    });

    expect(result.current.hasError).toBe(true);

    // Then trigger context restored
    act(() => {
      window.dispatchEvent(new Event('webglcontextrestored'));
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.contextLost).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWebGLCanvas());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('accepts componentName option for logging', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useWebGLCanvas({ componentName: 'TestCanvas' })
    );

    const event = new Event('webglcontextlost');
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('TestCanvas')
    );
    expect(result.current.hasError).toBe(true);

    consoleSpy.mockRestore();
  });

  it('caches WebGL support check result', () => {
    const getContextSpy = vi.fn((contextId: string) => {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return {};
      }
      return null;
    });
    HTMLCanvasElement.prototype.getContext = getContextSpy as any;
    clearWebGLSupportCache();

    // First render
    renderHook(() => useWebGLCanvas());

    // Second render
    renderHook(() => useWebGLCanvas());

    // getContext should only be called once due to caching
    // (actually called twice - once for webgl, once for experimental-webgl potentially)
    // But the key point is subsequent renders don't create new canvases
    const initialCallCount = getContextSpy.mock.calls.length;

    // Third render
    renderHook(() => useWebGLCanvas());

    // Should not increase since cached
    expect(getContextSpy.mock.calls.length).toBe(initialCallCount);
  });

  it('works with React.StrictMode double mounting', () => {
    // StrictMode causes effects to run twice
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // First mount
    const { unmount: unmount1 } = renderHook(() => useWebGLCanvas());
    unmount1();

    // Second mount (simulating StrictMode)
    const { result } = renderHook(() => useWebGLCanvas());

    // Should still work correctly
    expect(result.current.isSupported).toBe(true);
    expect(result.current.hasError).toBe(false);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
