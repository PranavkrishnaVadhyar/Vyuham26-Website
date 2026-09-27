import { useEffect, useState } from "react";

export function toast(message: string, tone: "ok" | "warn" = "ok") {
  window.dispatchEvent(new CustomEvent("vyuham:toast", { detail: { message, tone } }));
}

interface Item {
  id: number;
  message: string;
  tone: "ok" | "warn";
}

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const { message, tone } = (e as CustomEvent<{ message: string; tone: "ok" | "warn" }>).detail;
      const id = ++n;
      setItems((s) => [...s, { id, message, tone }]);
      window.setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3600);
    };
    window.addEventListener("vyuham:toast", on);
    return () => window.removeEventListener("vyuham:toast", on);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[150] flex w-[min(420px,92vw)] -translate-x-1/2 flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 border bg-[rgba(4,10,8,0.92)] px-4 py-3 backdrop-blur-xl"
          style={{
            borderColor: t.tone === "ok" ? "rgba(24,196,124,0.35)" : "rgba(242,201,138,0.35)",
            animation: "toastIn .6s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <span
            className="h-[6px] w-[6px] shrink-0 rounded-full"
            style={{ background: t.tone === "ok" ? "#18c47c" : "#f2c98a" }}
          />
          <span className="font-mono text-[10px] tracking-[0.18em] text-[#d5ece2]">{t.message}</span>
        </div>
      ))}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
