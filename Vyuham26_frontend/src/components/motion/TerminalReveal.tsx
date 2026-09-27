"use client";

import { useEffect, useRef } from "react";

interface TerminalRevealProps {
  text: string;
  className?: string;
  speed?: number;
  startInView?: boolean;
  onComplete?: () => void;
}

export default function TerminalReveal({
  text,
  className = "",
  onComplete,
}: TerminalRevealProps) {
  const completedRef = useRef(false);

  useEffect(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [onComplete]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span>{text}</span>
    </span>
  );
}