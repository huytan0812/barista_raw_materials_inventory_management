import { useRef } from "react";

export function useRenderCount() {
  const renderCount = useRef(1); // starts at 1 for the initial render
  renderCount.current += 1;
  return renderCount.current;
}