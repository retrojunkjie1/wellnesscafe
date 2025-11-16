// functions/aiBrain.js

"use strict";

/**
 * Central AI orchestrator for WellnessCafe.
 * - Text + planning → Fireworks (primary) / OpenAI (optional fallback)
 * - Memory layer → Pinecone (future)
 * - Media (video/voice/image) → stubs for Runway, Deepgram/ElevenLabs, etc.
 *
 * All HTTP Cloud Functions should call helpers from this module.
 */

// ---- ENV + CONSTANTS -------------------------------------------------------

// Support both old and new env var names for compatibility
const FIREWORKS_API_KEY=process.env.FIREWORKS_API_KEY||process.env.FIREWORKS_KEY;
const OPENAI_API_KEY=process.env.OPENAI_API_KEY||process.env.OPENAI_KEY||null;

const FIREWORKS_MODEL_SESSION=process.env.FIREWORKS_MODEL_SESSION
  ||"accounts/fireworks/models/deepseek-v3p1";

const RUNWAY_API_KEY=process.env.RUNWAY_API_KEY||process.env.RUNWAY_KEY||null;
const ELEVENLABS_API_KEY=process.env.ELEVENLABS_API_KEY||process.env.ELEVEN_KEY||null;
const ELEVENLABS_VOICE_ID=process.env.ELEVENLABS_VOICE_ID||"default";
const DEEPGRAM_API_KEY=process.env.DEEPGREAM_API_KEY||process.env.DEEPGRAM_API_KEY||process.env.DEEPGRAM_KEY||null;

// Optional: Pinecone (we'll wire properly in a later pass)
let pineconeClient=null;
const PINECONE_API_KEY=process.env.PINECONE_API_KEY||process.env.PINECONE_KEY;
if(PINECONE_API_KEY){
  try{
    // If you install the SDK: npm install @pinecone-database/pinecone
    const {Pinecone}=require("@pinecone-database/pinecone");
    pineconeClient=new Pinecone({apiKey:PINECONE_API_KEY});
  }catch(err){
    console.warn("Pinecone SDK not installed yet. Memory features disabled.");
  }
}

// ---- SMALL HELPERS ---------------------------------------------------------

const parseJsonFromLLM=(text)=>{
  if(!text)return null;
  try{return JSON.parse(text);}catch(err){}
  const match=text.match(/\{[\s\S]*\}/);
  if(match){
    try{return JSON.parse(match[0]);}catch(err2){}
  }
  throw new Error("Failed to parse JSON from LLM response.");
};

const callFireworksChat=async({systemPrompt,userPrompt,model})=>{
  if(!FIREWORKS_API_KEY){
    throw new Error("FIREWORKS_API_KEY missing. Set it in your Functions env.");
  }

  const res=await fetch("https://api.fireworks.ai/inference/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${FIREWORKS_API_KEY}`
    },
    body:JSON.stringify({
      model:model||FIREWORKS_MODEL_SESSION,
      temperature:0.5,
      response_format:{type:"json_object"},
      messages:[
        {role:"system",content:systemPrompt},
        {role:"user",content:userPrompt}
      ]
    })
  });

  if(!res.ok){
    const body=await res.text();
    console.error("Fireworks error",res.status,body);
    throw new Error("Fireworks API error");
  }

  const data=await res.json();
  const content=data.choices?.[0]?.message?.content;
  if(!content)throw new Error("Empty LLM response from Fireworks.");
  return parseJsonFromLLM(content);
};

// Simple NO-OP memory placeholders so nothing explodes
const rememberSessionToPinecone=async(sessionPlan,_userId)=>{
  if(!pineconeClient||!process.env.PINECONE_INDEX_NAME)return;
  // TODO: In a later pass, embed & upsert steps into Pinecone.
};

const recallFromPinecone=async(_query,_userId)=>{
  if(!pineconeClient||!process.env.PINECONE_INDEX_NAME)return [];
  // TODO: Later: query Pinecone and return top matches.
  return [];
};

// ---- PROMPTS: SESSION PLAN + TEMPLATES -------------------------------------

const buildSessionPlanPrompts=(payload)=>{
  const intent=payload.intent||"calm_anxiety";
  const mood=payload.mood||"unspecified";
  const duration=payload.duration||5;
  const userProfile=payload.userProfile||{};
  const pillars=payload.pillars||[
    "Breath","Body awareness","Values","Connection",
    "Spirituality","Recovery skills","Integration"
  ];

  const systemPrompt=
    "You are IKUKU, an ancient-modern cross-cultural wellness guide. "+
    "You design short, trauma-aware, spiritually grounded wellness sessions "+
    "that combine breathwork, body awareness, values, and recovery skills. "+
    "Return STRICT JSON, no commentary, matching this TypeScript style schema:\n\n"+
    "interface SessionPlan {"+
    " id:string; userId:string; intent:string; title:string; aiSummary:string;"+
    " totalMinutes:number; createdAtIso:string;"+
    " steps: SessionStep[]; followUpSuggestions:string[]; }\n"+
    "type StepKind='check_in'|'breath'|'meditation';\n"+
    "interface CheckInStep {id:string;kind:'check_in';order:number;title:string;description?:string;questions:{id:string;label:string;type:'scale'|'text';scaleMin?:number;scaleMax?:number;}[]}\n"+
    "interface BreathStep {id:string;kind:'breath';order:number;title:string;description?:string;durationSec:number;pattern:{inhale:number;exhale:number;holdTop?:number;holdBottom?:number};style:string;coaching:string}\n"+
    "interface MeditationStep {id:string;kind:'meditation';order:number;title:string;description?:string;durationSec:number;style:string;script:string}\n"+
    "Return: {\"sessionPlan\":SessionPlan}";

  const userPrompt=
    `User mood: ${mood}.\n`+
    `User intent: ${intent}.\n`+
    `Target duration (minutes): ${duration}.\n`+
    `Core pillars to weave in: ${pillars.join(", ")}.\n`+
    `User profile (may be empty): ${JSON.stringify(userProfile)}.\n`+
    "Design a grounded, realistic session. Keep steps between 2 and 5.\n"+
    "Make language gentle but honest. If the user is avoiding, gently call it out.\n"+
    "Use breath + check-ins + short meditations, not lectures.\n"+
    "All text must be safe for global audiences.";

  return {systemPrompt,userPrompt};
};

const buildTemplatePrompts=(payload)=>{
  const mood=payload.mood||"mixed";
  const intentGroup=payload.intentGroup||"quick_resets";

  const systemPrompt=
    "You are IKUKU, a wise session architect for an AI wellness marketplace. "+
    "Return STRICT JSON with 6 short session templates for a landing page.\n\n"+
    "Each template has:\n"+
    "id:string; slug:string; title:string; tagline:string; intent:string; "+
    "category:'quick_resets'|'morning_rituals'|'evening_wind_down'|'crisis_support'|'focus_clarity';"+
    "level:'beginner'|'intermediate'|'advanced';"+
    "minutes:number; steps:number; moodEmoji:string; "+
    "badges:string[]; mainPillars:string[];\n\n"+
    "Return: {\"templates\":Template[]}";

  const userPrompt=
    `User current mood cluster: ${mood}.\n`+
    `Primary category to emphasise: ${intentGroup}.\n`+
    "Create 6 diverse templates. Mix durations from 3–15 minutes.\n"+
    "Write concise, luxury-grade taglines that sound like a high-end wellness spa.\n"+
    "Do NOT include any explanation text. JSON only.";

  return {systemPrompt,userPrompt};
};

// ---- CORE BRAIN OPS --------------------------------------------------------

const createSessionPlan=async(payload)=>{
  const {systemPrompt,userPrompt}=buildSessionPlanPrompts(payload);
  const json=await callFireworksChat({systemPrompt,userPrompt});
  if(!json.sessionPlan)throw new Error("LLM did not return sessionPlan.");
  return json.sessionPlan;
};

const createTemplates=async(payload)=>{
  const {systemPrompt,userPrompt}=buildTemplatePrompts(payload);
  const json=await callFireworksChat({systemPrompt,userPrompt});
  if(!Array.isArray(json.templates))throw new Error("LLM did not return templates array.");
  return json.templates;
};

// ---- MEDIA STUBS (Runway, ElevenLabs, Deepgram, Images) --------------------
// These are architecture placeholders. They keep the routes ready, but
// they intentionally throw a clear TODO error so we don't lie about
// providers we haven't fully wired yet.

const createVideoWithRunway=async(_payload)=>{
  if(!RUNWAY_API_KEY){
    throw new Error("RUNWAY_API_KEY missing. Add it before enabling video.");
  }
  throw new Error("Runway video integration TODO: wire using their latest API docs.");
};

const synthesizeVoiceWithElevenLabs=async(_payload)=>{
  if(!ELEVENLABS_API_KEY){
    throw new Error("ELEVENLABS_API_KEY missing. Add it before enabling TTS.");
  }
  throw new Error("ElevenLabs TTS integration TODO: implement streaming/URL response.");
};

const transcribeWithDeepgram=async(_payload)=>{
  if(!DEEPGRAM_API_KEY){
    throw new Error("DEEPGRAM_API_KEY missing. Add it before enabling STT.");
  }
  throw new Error("Deepgram STT integration TODO: implement according to docs.");
};

const generateImageWithFireworksOrOpenAI=async(_payload)=>{
  // We'll use Fireworks/OpenAI image models in a later pass.
  throw new Error("Image generation integration TODO (use Fireworks/OpenAI images).");
};

// ---- HTTP HANDLERS FOR CLOUD FUNCTIONS ------------------------------------

/**
 * Main entry for /aiSession
 * - mode: "session"   → returns {sessionPlan}
 * - mode: "templates" → returns {templates}
 */
const handleSessionRequest=async(req,res)=>{
  if(req.method!=="POST"){
    return res.status(405).send("Method Not Allowed. Use POST.");
  }

  const body=req.body||{};
  const mode=body.mode||"session";
  const userId=body.userId||"anon";

  try{
    if(mode==="templates"){
      const templates=await createTemplates({
        mood:body.mood||"mixed",
        intentGroup:body.intentGroup||"quick_resets",
        userId
      });
      return res.json({templates});
    }

    // Default: single playable session
    const sessionPlan=await createSessionPlan({
      intent:body.intent||"calm_anxiety",
      mood:body.mood||"overwhelmed",
      duration:body.duration||5,
      userProfile:body.userProfile||{},
      pillars:body.pillars
    });

    // Fire-and-forget memory save
    rememberSessionToPinecone(sessionPlan,userId).catch((err)=>{
      console.warn("Pinecone memory save failed (non-blocking):",err.message);
    });

    return res.json({sessionPlan});
  }catch(err){
    console.error("aiSession error:",err);
    return res.status(500).json({
      error:"AI_ERROR",
      message:err.message||"Unknown AI error."
    });
  }
};

/**
 * Media router entry: /aiMedia
 * body: {type:"video"|"tts"|"stt"|"image", payload:{...}}
 */
const handleMediaRequest=async(req,res)=>{
  if(req.method!=="POST"){
    return res.status(405).send("Method Not Allowed. Use POST.");
  }

  const {type,payload}=req.body||{};
  if(!type)return res.status(400).json({error:"MISSING_TYPE"});

  try{
    let result;
    if(type==="video"){
      result=await createVideoWithRunway(payload||{});
    }else if(type==="tts"){
      result=await synthesizeVoiceWithElevenLabs(payload||{});
    }else if(type==="stt"){
      result=await transcribeWithDeepgram(payload||{});
    }else if(type==="image"){
      result=await generateImageWithFireworksOrOpenAI(payload||{});
    }else{
      return res.status(400).json({error:"UNKNOWN_TYPE"});
    }

    return res.json({result});
  }catch(err){
    console.error("aiMedia error:",err);
    return res.status(500).json({
      error:"MEDIA_ERROR",
      message:err.message||"Media generation error."
    });
  }
};

module.exports={
  handleSessionRequest,
  handleMediaRequest,
  // Export core generators in case we want to call them from other functions:
  createSessionPlan,
  createTemplates
};

