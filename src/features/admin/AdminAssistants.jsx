import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { sanitizeAssistant } from "../../schemas/assistantSchema";

const TYPES = ["sobriety", "housing", "legal", "funding"];

const AdminAssistants = ()=>{
  const [type, setType] = useState("sobriety");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState({ type: "sobriety", name: "" });
  const colName = useMemo(()=> `assistant_${type}`, [type]);

  const load = async ()=>{
    if (!db) return;
    setLoading(true);
    try{
      const q = query(collection(db, colName), orderBy("name"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d)=>({ id:d.id, ...d.data()})));
    }catch(e){
      // eslint-disable-next-line no-console
      console.warn("load assistants failed", e);
    }finally{ setLoading(false); }
  };

  useEffect(()=>{ load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colName]);

  const saveDraft = async ()=>{
    if (!db) return;
    const clean = sanitizeAssistant({ ...draft, type });
    const id = (clean.name || `${Date.now()}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await setDoc(doc(collection(db, colName), id), clean, { merge: true });
    setDraft({ type, name: "" });
    await load();
  };

  const remove = async (id)=>{
    if (!db) return;
    await deleteDoc(doc(collection(db, colName), id));
    await load();
  };

  return (
    <div className="container max-w-[980px] mx-auto my-8 px-4">
      <h1 className="text-2xl font-semibold">Admin · Assistants</h1>
      <p className="text-gray-600 mb-4">Manage assistant listings by type and sync manual corrections.</p>

      <div className="flex gap-3 items-center mb-4">
        <label htmlFor="type">Type</label>
        <select id="type" value={type} onChange={(e)=> setType(e.target.value)}>
          {TYPES.map((t)=> <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="button" className="ghost-btn" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="border rounded-md p-4 bg-white/70 backdrop-blur">
        <h2 className="text-lg font-semibold mb-2">Add / Edit</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={draft.name} onChange={(e)=> setDraft((d)=>({...d, name:e.target.value}))} placeholder="Name" />
          <input value={draft.description||''} onChange={(e)=> setDraft((d)=>({...d, description:e.target.value}))} placeholder="Description" />
          <input value={draft.contact?.phone||''} onChange={(e)=> setDraft((d)=>({...d, contact:{...(d.contact||{}), phone:e.target.value}}))} placeholder="Phone" />
          <input value={draft.contact?.email||''} onChange={(e)=> setDraft((d)=>({...d, contact:{...(d.contact||{}), email:e.target.value}}))} placeholder="Email" />
          <input value={draft.contact?.url||''} onChange={(e)=> setDraft((d)=>({...d, contact:{...(d.contact||{}), url:e.target.value}}))} placeholder="Website URL" />
          <input value={draft.address?.street||''} onChange={(e)=> setDraft((d)=>({...d, address:{...(d.address||{}), street:e.target.value}}))} placeholder="Street" />
          <input value={draft.address?.city||''} onChange={(e)=> setDraft((d)=>({...d, address:{...(d.address||{}), city:e.target.value}}))} placeholder="City" />
          <input value={draft.address?.state||''} onChange={(e)=> setDraft((d)=>({...d, address:{...(d.address||{}), state:e.target.value}}))} placeholder="State" />
          <input value={draft.address?.zip||''} onChange={(e)=> setDraft((d)=>({...d, address:{...(d.address||{}), zip:e.target.value}}))} placeholder="ZIP" />
          <input value={draft.insurance||''} onChange={(e)=> setDraft((d)=>({...d, insurance:e.target.value}))} placeholder="Insurance (comma / | separated)" />
          <input value={draft.gender||''} onChange={(e)=> setDraft((d)=>({...d, gender:e.target.value}))} placeholder="Gender (comma / | separated)" />
          <input value={draft.cost||''} onChange={(e)=> setDraft((d)=>({...d, cost:e.target.value}))} placeholder="Cost info" />
          <input value={draft.tags||''} onChange={(e)=> setDraft((d)=>({...d, tags:e.target.value}))} placeholder="Tags (comma / | separated)" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!draft.verified} onChange={(e)=> setDraft((d)=>({...d, verified:e.target.checked}))} /> Verified</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!draft.applyOnline} onChange={(e)=> setDraft((d)=>({...d, applyOnline:e.target.checked}))} /> Apply online</label>
          <input value={draft.applicationUrl||''} onChange={(e)=> setDraft((d)=>({...d, applicationUrl:e.target.value}))} placeholder="Application URL" />
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="ghost-btn" onClick={saveDraft}>Save</button>
          <button type="button" className="ghost-btn" onClick={()=> setDraft({ type, name: "" })}>Reset</button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-2">{items.length} items</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((it)=> (
          <div key={it.id} className="p-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{it.name}</h3>
                <p className="text-sm text-gray-700">{it.city}{it.state?`, ${it.state}`:''}</p>
                {it.verified && <span className="specialty-tag">Verified</span>}
                {Array.isArray(it.insurance) && it.insurance.length>0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {it.insurance.map((i)=> <span key={i} className="specialty-tag">{i}</span>)}
                  </div>
                )}
              </div>
              <button type="button" className="ghost-btn" onClick={()=> remove(it.id)}>Delete</button>
            </div>
            <p className="mt-2 text-gray-700 text-sm">{it.description}</p>
            {it.contact?.url && <a href={it.contact.url} className="ghost-btn mt-2" target="_blank" rel="noreferrer">Visit</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAssistants;
