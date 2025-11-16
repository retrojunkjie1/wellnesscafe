import {useState} from "react";

const AI_BRAIN_URL = "https://us-central1-wellnesscafelanding.cloudfunctions.net/aiBrain";

export const useAiBrain = ()=>{
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [reply,setReply] = useState("");

  const askBrain = async({task,message,userId,remember=true,provider})=>{
    setLoading(true);
    setError(null);

    try{
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

      setReply(data.reply);
      return data;
    }catch(err){
      setError(err.message);
      throw err;
    }finally{
      setLoading(false);
    }
  };

  return {askBrain,loading,error,reply};
};
