const AI_BRAIN_URL = "https://us-central1-wellnesscafelanding.cloudfunctions.net/aiBrain";

export const askBrain = async({task,message,userId,remember=false,provider})=>{
  const resp = await fetch(AI_BRAIN_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      task,
      userId: userId || "anonymous",
      remember,
      provider,
      payload:{message}
    })
  });

  const data = await resp.json();
  if(!resp.ok || !data.ok){
    throw new Error(data.error || "AI error");
  }
  return data;
};

export const askBrainTemplates = async()=>{
  const resp = await fetch(AI_BRAIN_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      task:"templates",
      userId:"anonymous",
      remember:false,
      payload:{message:"Generate 6 personalized wellness templates."}
    })
  });

  const data = await resp.json();
  return data.reply;
};

