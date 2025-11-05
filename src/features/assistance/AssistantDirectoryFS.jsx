import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const toTitle = (s)=> s ? s.charAt(0).toUpperCase()+s.slice(1) : '';

const AssistantDirectoryFS = ({ type="sobriety" })=>{
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const col = useMemo(()=> `assistant_${type}`, [type]);

  useEffect(()=>{
    let alive = true;
    (async ()=>{
      setLoading(true);
      try{
        if (!db){ setItems([]); return; }
        const snap = await getDocs(query(collection(db, col), orderBy('name')));
        const rows = snap.docs.map((d)=> ({ id:d.id, ...d.data() }));
        if (!alive) return;
        setItems(rows);
      }catch(e){
        // eslint-disable-next-line no-console
        console.warn('assistants fs fetch failed', e);
        if (!alive) return;
        setItems([]);
      }finally{
        if (alive) setLoading(false);
      }
    })();
    return ()=>{ alive=false; };
  }, [col]);

  const allStates = useMemo(()=> Array.from(new Set(items.map((i)=> i.state).filter(Boolean))).sort(), [items]);
  const allCities = useMemo(()=> Array.from(new Set(items.map((i)=> i.city).filter(Boolean))).sort(), [items]);
  const allInsurances = useMemo(()=>{
    const set = new Set();
    for (const it of items){
      if (Array.isArray(it.insurance)) for (const v of it.insurance) set.add(String(v));
    }
    return Array.from(set).sort();
  }, [items]);
  const allGenders = useMemo(()=>{
    const set = new Set();
    for (const it of items){
      if (Array.isArray(it.gender)) for (const v of it.gender) set.add(String(v));
    }
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(()=>{
    const q = qText.toLowerCase();
    return items.filter((it)=>{
      const name = (it.name||'').toLowerCase();
      const desc = (it.description||'').toLowerCase();
      const city = (it.city||'').toLowerCase();
      const state = (it.state||'').toLowerCase();
      const ins = Array.isArray(it.insurance) ? it.insurance.map((s)=> String(s).toLowerCase()) : [];
      const gen = Array.isArray(it.gender) ? it.gender.map((s)=> String(s).toLowerCase()) : [];
      return (
        (!q || name.includes(q) || desc.includes(q) || city.includes(q) || state.includes(q)) &&
        (!verifiedOnly || !!it.verified) &&
        (!stateFilter || state === stateFilter.toLowerCase()) &&
        (!cityFilter || city === cityFilter.toLowerCase()) &&
        (!insuranceFilter || ins.includes(insuranceFilter.toLowerCase())) &&
        (!genderFilter || gen.includes(genderFilter.toLowerCase()))
      );
    });
  }, [items, qText, stateFilter, cityFilter, insuranceFilter, genderFilter, verifiedOnly]);

  if (loading){
    return <div className="container max-w-[980px] mx-auto my-8 px-4">Loading {toTitle(type)} directory…</div>;
  }

  return (
    <div className="container max-w-[980px] mx-auto my-8 px-4">
      <header className="page-hero">
        <h1>{toTitle(type)} Assistance</h1>
        <p>Search {items.length} listings from trusted sources and local corrections.</p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 border-b border-gray-200">
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          <input
            type="search"
            value={qText}
            onChange={(e)=> setQText(e.target.value)}
            placeholder="Search by name, description, city, state"
            className="w-full md:flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60"
            aria-label="Search assistants"
          />
          <select value={stateFilter} onChange={(e)=> setStateFilter(e.target.value)} className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60" aria-label="Filter by state">
            <option value="">All states</option>
            {allStates.map((s)=> <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={cityFilter} onChange={(e)=> setCityFilter(e.target.value)} className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60" aria-label="Filter by city">
            <option value="">All cities</option>
            {allCities.map((c)=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={insuranceFilter} onChange={(e)=> setInsuranceFilter(e.target.value)} className="w-full md:w-56 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60" aria-label="Filter by insurance">
            <option value="">All insurance</option>
            {allInsurances.map((i)=> <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={genderFilter} onChange={(e)=> setGenderFilter(e.target.value)} className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60" aria-label="Filter by gender">
            <option value="">All genders</option>
            {allGenders.map((g)=> <option key={g} value={g}>{g}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={verifiedOnly} onChange={(e)=> setVerifiedOnly(e.target.checked)} /> Verified only</label>
          {(stateFilter || cityFilter || insuranceFilter || genderFilter || verifiedOnly || qText) && (
            <button type="button" className="ghost-btn" onClick={()=>{ setQText(''); setStateFilter(''); setCityFilter(''); setInsuranceFilter(''); setGenderFilter(''); setVerifiedOnly(false); }}>Clear</button>
          )}
        </div>
        <div className="text-sm text-gray-600">{filtered.length} result{filtered.length===1?'':'s'}</div>
      </div>

      <section className="card-grid section">
        {filtered.slice(0, 200).map((it)=>{
          const key = it.id || `${it.name}-${it.city}`;
          return (
            <div key={key} className="p-card">
              <h3>{it.name}</h3>
              <p className="text-gray-700 my-1.5">{it.city}{it.state?`, ${it.state}`:''}</p>
              {it.verified && <span className="specialty-tag mr-1.5">Verified</span>}
              {Array.isArray(it.tags)&&it.tags.length>0 && (
                <p className="my-1.5">{it.tags.map((t)=> <span key={t} className="specialty-tag mr-1.5">{t}</span>)}</p>
              )}
              {Array.isArray(it.insurance)&&it.insurance.length>0 && (
                <p className="my-1.5">{it.insurance.map((ins)=> <span key={ins} className="specialty-tag mr-1.5">{ins}</span>)}</p>
              )}
              {it.description && <p className="text-gray-700 my-1.5">{it.description}</p>}
              {it.contact?.url && (
                <p className="mt-2"><a href={it.contact.url} target="_blank" rel="noreferrer" className="ghost-btn">Visit site</a></p>
              )}
              <div className="flex gap-2 mt-2">
                {it.contact?.phone && <a href={`tel:${it.contact.phone}`} className="ghost-btn">Call</a>}
                {it.contact?.email && <a href={`mailto:${it.contact.email}`} className="ghost-btn">Email</a>}
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <p>No listings found.</p>}
      </section>
    </div>
  );
};

AssistantDirectoryFS.propTypes = {
  type: PropTypes.oneOf(["sobriety","housing","legal","funding"]),
};

export default AssistantDirectoryFS;
