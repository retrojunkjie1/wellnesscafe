import React, {useEffect, useMemo, useRef, useState} from 'react';
import {getAuth} from 'firebase/auth';
import {getFirestore, collection, addDoc, serverTimestamp} from 'firebase/firestore';

// Speech helper (browser TTS)
const speak=(text)=>{try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=0.9;u.pitch=1;u.volume=1;window.speechSynthesis.speak(u);}catch(e){}};

// Simple rules-based recommendation
const makeRecommendation=({cycles,inhale,hold,exhale,moodBefore,moodAfter})=>{
  const delta=(moodAfter??0)-(moodBefore??0);
  const lengthSec=cycles*(inhale+hold+exhale);
  const tips=[];
  if(inhale<4||exhale<4){tips.push('Try longer, slower breaths for deeper parasympathetic activation.');}
  if(exhale<inhale){tips.push('Make exhale ≥ inhale to promote relaxation.');}
  if(lengthSec<120){tips.push('Aim for at least 2–3 minutes for a noticeable shift.');}
  if(delta<=0){tips.push('Consider box-breathing (4-4-4-4) or extending exhale to 6–8s.');}
  if(delta>0){tips.push('Nice response—keep the same pacing and increase total time gradually.');}
  const summary=`Session: ${cycles} cycles @ ${inhale}/${hold}/${exhale}s. Mood change: ${delta>0?`+${delta}`:delta}.`;
  return {summary,tips};
};

const Phase={Inhale:'inhale',Hold:'hold',Exhale:'exhale',Idle:'idle'};

const BreathingTool=({defaultInhale=4,defaultHold=4,defaultExhale=6,defaultCycles=6})=>{
  const auth=getAuth();
  const db=getFirestore();

  // UI/Config
  const [inhale,setInhale]=useState(defaultInhale);
  const [hold,setHold]=useState(defaultHold);
  const [exhale,setExhale]=useState(defaultExhale);
  const [cycles,setCycles]=useState(defaultCycles);

  // Mood
  const [moodBefore,setMoodBefore]=useState(5); // 1–10
  const [moodAfter,setMoodAfter]=useState(5);

  // Session state
  const [phase,setPhase]=useState(Phase.Idle);
  const [currentCycle,setCurrentCycle]=useState(0);
  const [secondsLeft,setSecondsLeft]=useState(0);
  const [running,setRunning]=useState(false);
  const [startedAt,setStartedAt]=useState(null);
  const [endedAt,setEndedAt]=useState(null);
  const [saving,setSaving]=useState(false);
  const [lastRecommendation,setLastRecommendation]=useState(null);
  const tickRef=useRef(null);

  const maxRadius=useMemo(()=>120,[]);
  const radius=useMemo(()=>{
    // Animate radius by phase + remaining time
    if(!running||phase===Phase.Idle){return 40;}
    const total=phase===Phase.Inhale?inhale:phase===Phase.Hold?hold:exhale;
    const progress=total>0?1-(secondsLeft/total):0;
    if(phase===Phase.Inhale){return 40+(maxRadius-40)*progress;}
    if(phase===Phase.Hold){return maxRadius;}
    if(phase===Phase.Exhale){return maxRadius-(maxRadius-40)*progress;}
    return 40;
  },[running,phase,secondsLeft,inhale,hold,exhale,maxRadius]);

  const nextPhase=()=> {
    if(phase===Phase.Idle){setPhase(Phase.Inhale);setSecondsLeft(inhale);speak('Inhale');return;}
    if(phase===Phase.Inhale){setPhase(hold>0?Phase.Hold:Phase.Exhale);setSecondsLeft(hold>0?hold:exhale);speak(hold>0?'Hold':'Exhale');return;}
    if(phase===Phase.Hold){setPhase(Phase.Exhale);setSecondsLeft(exhale);speak('Exhale');return;}
    if(phase===Phase.Exhale){
      const next=currentCycle+1;
      if(next>=cycles){
        setRunning(false);
        setPhase(Phase.Idle);
        setEndedAt(new Date());
        speak('Session complete');
        return;
      }
      setCurrentCycle(next);
      setPhase(Phase.Inhale);
      setSecondsLeft(inhale);
      speak('Inhale');
      return;
    }
  };

  const startSession=()=> {
    if(!auth.currentUser){alert('Please sign in to start a session.');return;}
    setStartedAt(new Date());
    setEndedAt(null);
    setCurrentCycle(0);
    setPhase(Phase.Inhale);
    setSecondsLeft(inhale);
    setRunning(true);
    speak('Starting breathing session. Inhale.');
  };

  const pauseSession=()=> {
    setRunning(false);
    speak('Paused');
  };

  const resumeSession=()=> {
    if(phase===Phase.Idle){nextPhase();}
    setRunning(true);
    speak('Resuming');
  };

  const stopSession=()=> {
    setRunning(false);
    setPhase(Phase.Idle);
    setSecondsLeft(0);
    setEndedAt(new Date());
    speak('Stopped');
  };

  // Timer
  useEffect(()=> {
    if(!running){if(tickRef.current){clearInterval(tickRef.current);tickRef.current=null;}return;}
    tickRef.current=setInterval(()=> {
      setSecondsLeft((s)=>{
        const next=s-1;
        if(next<=0){nextPhase();return 0;}
        return next;
      });
    },1000);
    return ()=>{if(tickRef.current){clearInterval(tickRef.current);tickRef.current=null;}};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[running,phase]);

  // Auto-save when finished
  useEffect(()=> {
    const completed=!running&&startedAt&&endedAt&&phase===Phase.Idle;
    if(!completed){return;}
    const doSave=async()=> {
      try{
        setSaving(true);
        const uid=auth.currentUser?.uid;
        if(!uid){setSaving(false);return;}
        const totalDurationSec=Math.max(1,Math.round((endedAt.getTime()-startedAt.getTime())/1000));
        const rec=makeRecommendation({cycles:currentCycle+1,inhale,hold,exhale,moodBefore,moodAfter});
        setLastRecommendation(rec);
        await addDoc(collection(db,`users/${uid}/breathingSessions`),{
          uid,
          startedAt:serverTimestamp(),
          endedAt:serverTimestamp(),
          clientStartedAt:startedAt.toISOString(),
          clientEndedAt:endedAt.toISOString(),
          totalDurationSec,
          cyclesCompleted:currentCycle+1,
          durations:{inhale,hold,exhale},
          moodBefore,
          moodAfter,
          recommendation:rec,
          tool:'breathing_v1'
        });
      }catch(e){console.error(e);}
      finally{setSaving(false);}
    };
    doSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[running,phase,startedAt,endedAt]);

  const canStart=useMemo(()=>!running&&phase===Phase.Idle,[running,phase]);

  const phaseLabel=useMemo(()=>{
    if(phase===Phase.Inhale){return 'Inhale';}
    if(phase===Phase.Hold){return 'Hold';}
    if(phase===Phase.Exhale){return 'Exhale';}
    return 'Ready';
  },[phase]);

  return (
    <div style={{display:'grid',gap:'16px',maxWidth:680,margin:'0 auto'}}>
      <h2 style={{margin:'8px 0'}}>Breathing Tool</h2>

      {/* Config */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px'}}>
        <label>Inhale (s)
          <input type="number" min="2" max="10" value={inhale} onChange={(e)=>setInhale(parseInt(e.target.value||'0',10))} />
        </label>
        <label>Hold (s)
          <input type="number" min="0" max="10" value={hold} onChange={(e)=>setHold(parseInt(e.target.value||'0',10))} />
        </label>
        <label>Exhale (s)
          <input type="number" min="3" max="12" value={exhale} onChange={(e)=>setExhale(parseInt(e.target.value||'0',10))} />
        </label>
        <label>Cycles
          <input type="number" min="1" max="20" value={cycles} onChange={(e)=>setCycles(parseInt(e.target.value||'0',10))} />
        </label>
      </div>

      {/* Mood */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px'}}>
        <label>Mood Before (1–10)
          <input type="number" min="1" max="10" value={moodBefore} onChange={(e)=>setMoodBefore(parseInt(e.target.value||'1',10))} />
        </label>
        <label>Mood After (1–10)
          <input type="number" min="1" max="10" value={moodAfter} onChange={(e)=>setMoodAfter(parseInt(e.target.value||'1',10))} />
        </label>
      </div>

      {/* Visual breath circle */}
      <div style={{display:'grid',placeItems:'center',height:320,border:'1px solid #eee',borderRadius:12}}>
        <svg width="320" height="320" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r={radius} fill="#E8F5E9" />
          <text x="160" y="150" textAnchor="middle" fontSize="18" fontWeight="600">{phaseLabel}</text>
          <text x="160" y="175" textAnchor="middle" fontSize="14">{secondsLeft>0?`${secondsLeft}s`:''}</text>
          <text x="160" y="205" textAnchor="middle" fontSize="12">Cycle {Math.min(currentCycle+1,cycles)} / {cycles}</text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {canStart&&(<button onClick={startSession}>Start</button>)}
        {!canStart&&running&&(<button onClick={pauseSession}>Pause</button>)}
        {!canStart&&!running&&phase!==Phase.Idle&&(<button onClick={resumeSession}>Resume</button>)}
        {(running||phase!==Phase.Idle)&&(<button onClick={stopSession}>Stop</button>)}
      </div>

      {/* TTS toggle hint */}
      <small>Tip: ensure system sound is on; this uses your browser's voice.</small>

      {/* Recommendation preview after save */}
      {lastRecommendation&&(
        <div style={{border:'1px solid #eee',borderRadius:12,padding:12}}>
          <strong>Recommendation</strong>
          <p style={{margin:'8px 0'}}>{lastRecommendation.summary}</p>
          <ul style={{margin:'0 0 0 18px'}}>
            {lastRecommendation.tips.map((t,i)=>(<li key={i}>{t}</li>))}
          </ul>
        </div>
      )}

      {saving&&<em>Saving session...</em>}
    </div>
  );
};

export default BreathingTool;
