/* Long-term memory layer: embed text + store in Pinecone */

const FIREWORKS_KEY = process.env.FIREWORKS_KEY;
const PINECONE_KEY = process.env.PINECONE_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST; // full https host
const PINECONE_INDEX = process.env.PINECONE_INDEX || "wellnesscafe-memory";

const EMBEDDING_MODEL = "nomic-ai/nomic-embed-text-v1.5";

const embedText = async(text)=>{
  if(!FIREWORKS_KEY){throw new Error("FIREWORKS_KEY missing for embeddings");}

  const body = {
    model: EMBEDDING_MODEL,
    input: text
  };

  const resp = await fetch("https://api.fireworks.ai/inference/v1/embeddings",{
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json",
      "Authorization":`Bearer ${FIREWORKS_KEY}`
    },
    body:JSON.stringify(body)
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`Fireworks embeddings ${resp.status}: ${t}`);
  }

  const json = await resp.json();
  const vec = json.data?.[0]?.embedding;
  if(!vec){throw new Error("No embedding returned");}
  return vec;
};

const upsertToPinecone = async({id,values,metadata,namespace})=>{
  if(!PINECONE_KEY || !PINECONE_HOST){
    console.warn("Pinecone not configured, skipping memory upsert");
    return false;
  }

  const body = {
    vectors:[{id,values,metadata}],
    namespace: namespace || "default"
  };

  const resp = await fetch(`${PINECONE_HOST}/vectors/upsert`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Api-Key":PINECONE_KEY
    },
    body:JSON.stringify(body)
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`Pinecone upsert ${resp.status}: ${t}`);
  }

  return true;
};

/**
 * Store a memory for a user: e.g. session summary, preferences, values.
 */
const rememberTextForUser = async({userId,topic,text})=>{
  const values = await embedText(text);
  const id = `${userId}-${Date.now()}`;
  const metadata = {userId,topic,createdAt:new Date().toISOString()};
  await upsertToPinecone({id,values,metadata,namespace:userId});
  return {id};
};

module.exports = {
  rememberTextForUser
};

