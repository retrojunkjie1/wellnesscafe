/* Central LLM provider router for WellnessCafe AI */

const {OpenAI} = require("openai");

// ---- Keys ----
const OPENAI_KEY = process.env.OPENAI_KEY;
const FIREWORKS_KEY = process.env.FIREWORKS_KEY;
const GROQ_KEY = process.env.GROQ_KEY;

// ---- Low-level calls ----

const callFireworksChat = async({messages,systemPrompt,model})=>{
  if(!FIREWORKS_KEY){throw new Error("FIREWORKS_KEY missing");}

  const body = {
    model: model || "accounts/fireworks/models/deepseek-v3",
    max_tokens: 1024,
    temperature: 0.6,
    messages: [
      ...(systemPrompt?[{role:"system",content:systemPrompt}]:[]),
      ...messages
    ]
  };

  const resp = await fetch("https://api.fireworks.ai/inference/v1/chat/completions",{
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json",
      "Authorization":`Bearer ${FIREWORKS_KEY}`
    },
    body:JSON.stringify(body)
  });

  if(!resp.ok){
    const text = await resp.text();
    throw new Error(`Fireworks ${resp.status}: ${text}`);
  }
  const json = await resp.json();
  return {
    provider:"fireworks",
    raw:json,
    text:json.choices?.[0]?.message?.content?.toString() || ""
  };
};

const callOpenAIChat = async({messages,systemPrompt,model})=>{
  if(!OPENAI_KEY){throw new Error("OPENAI_KEY missing");}

  const client = new OpenAI({apiKey:OPENAI_KEY});
  const resp = await client.chat.completions.create({
    model: model || "gpt-4.1-mini",
    temperature:0.6,
    max_tokens:1024,
    messages:[
      ...(systemPrompt?[{role:"system",content:systemPrompt}]:[]),
      ...messages
    ]
  });

  const choice = resp.choices?.[0]?.message;
  return {
    provider:"openai",
    raw:resp,
    text:(choice?.content || "").toString()
  };
};

// Cheap / fast reasoning path – Groq (text only)
const callGroqChat = async({messages,systemPrompt,model})=>{
  if(!GROQ_KEY){throw new Error("GROQ_KEY missing");}

  const body = {
    model: model || "llama-3.1-70b-versatile",
    temperature:0.6,
    max_tokens:1024,
    messages:[
      ...(systemPrompt?[{role:"system",content:systemPrompt}]:[]),
      ...messages
    ]
  };

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${GROQ_KEY}`
    },
    body:JSON.stringify(body)
  });

  if(!resp.ok){
    const text = await resp.text();
    throw new Error(`Groq ${resp.status}: ${text}`);
  }
  const json = await resp.json();
  return {
    provider:"groq",
    raw:json,
    text:json.choices?.[0]?.message?.content?.toString() || ""
  };
};

// ---- Router ----

/**
 * routeLLM({task,provider,fast,systemPrompt,messages})
 * - provider: "fireworks" | "openai" | "groq" | undefined
 * - fast: if true, prefer Groq when available
 */
const routeLLM = async({task,provider,fast,systemPrompt,messages})=>{
  let selected = provider;

  if(!selected){
    if(fast && GROQ_KEY){selected = "groq";}
    else if(FIREWORKS_KEY){selected = "fireworks";}
    else{selected = "openai";}
  }

  if(selected === "fireworks"){
    return callFireworksChat({messages,systemPrompt});
  }
  if(selected === "groq"){
    return callGroqChat({messages,systemPrompt});
  }
  return callOpenAIChat({messages,systemPrompt});
};

module.exports = {
  routeLLM
};

