import React, { useMemo, useRef, useState } from "react";
/* eslint-disable react/prop-types */

const AskWellnessAI = ({ stateSlug, snippets }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const boxRef = useRef(null);

  const canSend = useMemo(
    () => !busy && input.trim().length > 1,
    [busy, input]
  );

  const send = async () => {
    if (!canSend) {
      return;
    }
    const msg = input.trim();
    setInput("");
    setBusy(true);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((m) => [...m, { id, role: "user", text: msg }]);
    try {
      const res = await fetch("/api/aiAsk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          state: stateSlug || undefined,
          category: "soberHomes",
          snippets:
            Array.isArray(snippets) && snippets.length
              ? snippets.slice(0, 5)
              : undefined,
        }),
      });
      const data = await res.json();
      let text = "No response";
      if (data?.text) {
        text = data.text;
      } else if (data?.error) {
        text = `Error: ${data.error}`;
      }
      const rid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setMessages((m) => [...m, { id: rid, role: "assistant", text }]);
      setBusy(false);
      // scroll to bottom
      requestAnimationFrame(() => {
        if (boxRef.current) {
          boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("AskWellnessAI send error", err);
      const rid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setMessages((m) => [
        ...m,
        { id: rid, role: "assistant", text: "Error contacting AI." },
      ]);
      setBusy(false);
    }
  };

  return (
    <div>
      {/* Floating launcher */}
      <button
        type="button"
        className="fixed bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open ? "true" : "false"}
        aria-controls="ask-wellness-ai"
      >
        {open ? "Close AI" : "Ask Wellness AI"}
      </button>

      {open && (
        <div
          id="ask-wellness-ai"
          className="fixed bottom-20 right-5 w-[min(92vw,380px)] max-h-[70vh] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col"
        >
          <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="text-sm font-semibold">WellnessCafe AI</div>
            <div className="text-xs text-gray-500">Experimental</div>
          </div>
          <div
            ref={boxRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-gray-500">
                Ask about sober living, referrals, or resources. Example: "Find
                sober living options in Florida with MAT."
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "inline-block bg-indigo-600 text-white px-3 py-2 rounded-2xl"
                      : "inline-block bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl"
                  }
                >
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Type your question..."
                aria-label="Ask Wellness AI"
                disabled={busy}
              />
              <button
                type="button"
                className="ghost-btn"
                onClick={send}
                disabled={!canSend}
              >
                {busy ? "..." : "Send"}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              AI may make mistakes. Verify important info.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskWellnessAI;
