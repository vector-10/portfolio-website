"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const say = useCallback((text: string) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const toast = (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-inv-bg px-4 py-2.5 text-[13px] text-inv-ink ${
        message ? "" : "hidden"
      }`}
    >
      {message}
    </div>
  );
  return { say, toast };
}
