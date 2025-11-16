import React,{useState} from "react";
import {useAiBrain} from "../lib/useAiBrain";

const AiConsole = ()=>{
  const [input,setInput] = useState("");
  const {askBrain,loading,error,reply} = useAiBrain();

  const handleAsk = async()=>{
    if(!input.trim()){return;}
    await askBrain({
      task:"session_plan",
      message:input,
      userId:"demo-web",
      remember:true
    });
  };

  return (
    <div className="fixed bottom-6 right-6 max-w-md p-4 rounded-2xl bg-slate-900/90 text-slate-50 shadow-2xl backdrop-blur">
      <div className="text-sm font-semibold mb-2">WellnessCafe AI Console</div>
      <textarea
        className="w-full text-sm rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 mb-2"
        rows={3}
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Ask for a session, guidance, or a quick reset..."
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-brand text-slate-900 font-semibold disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Ask WellnessCafe AI"}
      </button>
      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
      {reply && (
        <div className="mt-3 text-xs max-h-40 overflow-y-auto whitespace-pre-line">
          {reply}
        </div>
      )}
    </div>
  );
};

export default AiConsole;
