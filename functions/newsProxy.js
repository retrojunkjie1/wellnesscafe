const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

// Fetch article content safely and strip scripts/styles/iframes
app.get("/api/news", async (req, res)=>{
  const url = String(req.query.url || req.query.u || "").trim();
  if(!/^https?:\/\//i.test(url)){
    return res.status(400).send("Missing or bad URL");
  }
  try{
    const upstream = await fetch(url, { redirect: "follow" });
    if(!upstream.ok){
      return res.status(502).send("Upstream error");
    }
    const html = await upstream.text();
    const sanitized = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
    res.status(200).send(sanitized);
  }catch(err){
    console.error("newsProxy /api/news error", err);
    res.status(500).send("Unable to load article");
  }
});

// Proxy images so they render under our domain
app.get("/api/image", async (req, res)=>{
  const url = String(req.query.url || req.query.u || "").trim();
  if(!/^https?:\/\//i.test(url)){
    return res.status(400).send("Missing image URL");
  }
  try{
    const upstream = await fetch(url, { redirect: "follow" });
    if(!upstream.ok){
      return res.status(502).send("Upstream image error");
    }
    const type = upstream.headers.get("content-type") || "image/jpeg";
    res.set("content-type", type);
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.status(200).send(buf);
  }catch(err){
    console.error("newsProxy /api/image error", err);
    res.status(500).send("Image proxy failed");
  }
});

module.exports = app;
