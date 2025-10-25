// src/Views/HomePage.js
import React,{useEffect,useMemo,useState} from 'react';
import './HomePage.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import {auth,db} from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc,getDoc,setDoc,updateDoc} from 'firebase/firestore';

const interestCatalog=['yoga','acuwellness','spiritual','na-aa','events','recovery-tools','gov-assist'];

const HomePage=()=>{
  const [colorMode,setColorMode]=useState('calm');
  const [loading,setLoading]=useState(true);
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [editInterests,setEditInterests]=useState([]);

  const toggleColor=()=>{setColorMode((prev)=>(prev==='calm'?'energy':'calm'));};

  // Auth + profile bootstrap
  useEffect(()=>{
    if(!auth || !db){
      // Firebase not configured; skip auth bootstrap
      setLoading(false);
      return;
    }
    const unsub=onAuthStateChanged(auth,async(u)=>{
      setUser(u||null);
      if(!u){setProfile(null);setLoading(false);return;}
      const ref = doc(db, 'users', 'demoUser001');
      const snap=await getDoc(ref);
      if(!snap.exists()){
        const seed={displayName:u.displayName||'Friend',interests:['recovery-tools','na-aa'],goals:{dailyMinutes:10,weeklyMeetings:1,streak:0,progress:0},lastCheckIn:new Date().toISOString(),riskScore:12,alerts:[]};
        await setDoc(ref,seed);
        setProfile(seed);
        setEditInterests(seed.interests);
      }else{
        const data=snap.data();
        setProfile(data);
        setEditInterests(data.interests||[]);
      }
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  // Simple “AI” relapse flagging (placeholder logic; move server-side later)
  const aiFlags=useMemo(()=>{
    if(!profile){return [];}
    const flags=[];
    const last=new Date(profile.lastCheckIn||0);
    const daysSince=Math.floor((Date.now()-last.getTime())/86400000);
    if(daysSince>=2){flags.push(`No check-in for ${daysSince} days`);}
    if((profile.riskScore||0)>=60){flags.push('Elevated risk detected');}
    if((profile.goals?.weeklyMeetings||0)>0 && (profile.goals?.streak||0)===0){flags.push('Streak reset — rebuild momentum');}
    return flags.concat(profile.alerts||[]);
  },[profile]);

  const progressPct=Math.max(0,Math.min(100,profile?.goals?.progress||0));

  const handleInterestToggle=(key)=>{
    setEditInterests((prev)=>prev.includes(key)?prev.filter((k)=>k!==key):[...prev,key]);
  };

  const saveInterests=async()=>{
    if(!user || !db){return;}
    const ref=doc(db,'users',user.uid);
    await updateDoc(ref,{interests:editInterests});
    setProfile((p)=>({...p,interests:editInterests}));
  };

  return (
    <div className={`wellcafe-homepage ${colorMode}`}>
      <Header />
      <main className="homepage-content">
        <section className="hero">
          <div className="hero-badge">✨ New: AI Wellness Insights</div>
          <h1 className="hero-title">Think Better with <span className="brand">WellnessCafe</span></h1>
          <p className="hero-sub">Never miss a moment of calm, balance, or connection.</p>
          <div className="hero-cta">
            <button className="wellcafe-button" onClick={toggleColor}>Toggle theme</button>
            {!user && (<Link className="ghost-btn" to="/login">Login to personalize</Link>)}
          </div>
          <div className="hero-bowl-glow" aria-hidden="true" />
        </section>

        {loading && (<div className="card loading">Loading your wellness space…</div>)}

        {!loading && !user && (
          <section className="card">
            <h3>Personalize your journey</h3>
            <p>Create an account to set interests, track goals, and receive AI alerts when red flags appear.</p>
            <a className="wellcafe-button" href="/signup">Create free account</a>
          </section>
        )}

        {!loading && user && profile && (
          <>
            <section className="grid">
              <div className="card">
                <h3 className="card-title">Welcome back, {profile.displayName||'Friend'}</h3>
                <p className="muted">Your current focus areas:</p>
                <div className="chips">
                  {(profile.interests||[]).map((i)=>(<span key={i} className="chip">{i}</span>))}
                </div>
                <div className="progress-wrap" role="progressbar" aria-valuenow={progressPct} aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar" style={{width:`${progressPct}%`}} />
                </div>
                <p className="muted small">Goal progress: {progressPct}% · Streak: {profile.goals?.streak||0} days</p>
              </div>

              <div className="card">
                <h3 className="card-title">AI Alerts & Red Flags</h3>
                {aiFlags.length===0 && (<p className="muted">All clear. Keep breathing steady.</p>)}
                {aiFlags.length>0 && (
                  <ul className="alerts">
                    {aiFlags.map((t,idx)=>(<li key={idx}>{t}</li>))}
                  </ul>
                )}
                <Link className="ghost-btn" to="/check-in">Do a 2-min check-in</Link>
              </div>

              <div className="card">
                <h3 className="card-title">Edit interests</h3>
                <div className="pill-grid">
                  {interestCatalog.map((k)=>(
                    <button key={k} className={`pill ${editInterests.includes(k)?'on':'off'}`} onClick={()=>handleInterestToggle(k)}>{k}</button>
                  ))}
                </div>
                <div className="row">
                  <button className="wellcafe-button" onClick={saveInterests}>Save</button>
                  <Link className="ghost-btn" to="/programs">Explore programs</Link>
                </div>
              </div>
            </section>

            <section className="grid">
              <Link className="card link" to="/events">
                <h3 className="card-title">Live Events & NA/AA</h3>
                <p className="muted">Find today’s meetings, yoga & acuwellness sessions.</p>
              </Link>
              <Link className="card link" to="/tools">
                <h3 className="card-title">Recovery Tools</h3>
                <p className="muted">Trigger tracker, cravings log, daily intentions, breath timer.</p>
              </Link>
              <Link className="card link" to="/spiritual">
                <h3 className="card-title">Spiritual Counseling</h3>
                <p className="muted">Group circles, 1:1 guidance, mindful rituals.</p>
              </Link>
              <Link className="card link" to="/assist">
                <h3 className="card-title">Government Assistance</h3>
                <p className="muted">Curated benefits, housing, food & healthcare links.</p>
              </Link>
            </section>
          </>
        )}
      </main>

      <footer className="wc-footer">
        <div className="wc-footer-inner">
          <span>© {new Date().getFullYear()} WellnessCafe AI</span>
          <nav className="wc-footer-nav">
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/changelog">Changelog</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
