import React, { useEffect, useRef, useState } from "react";

interface VoiceControlProps {
  text: string;
}

export default function VoiceControl({ text }: VoiceControlProps) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (utterRef.current) window.speechSynthesis.cancel();
    };
  }, []);

  if (!canSpeak) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded border px-2 py-1 text-xs hover:bg-secondary"
        onClick={() => {
          if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
          }
          const u = new SpeechSynthesisUtterance(text);
          utterRef.current = u;
          u.onend = () => setSpeaking(false);
          setSpeaking(true);
          window.speechSynthesis.speak(u);
        }}
      >
        {speaking ? "Stop voice" : "Speak step"}
      </button>
    </div>
  );
}
