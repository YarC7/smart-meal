/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import Timer from "./Timer";

let container: HTMLDivElement;

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(container);
  });

  it("calls onComplete after countdown", () => {
    const onComplete = vi.fn();
    const root = createRoot(container);
    act(() => {
      root.render(<Timer seconds={3} autoStart onComplete={onComplete} />);
    });
    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
