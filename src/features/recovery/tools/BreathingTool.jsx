import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getAuth} from 'firebase/auth';
import {getFirestore, collection, addDoc, serverTimestamp} from 'firebase/firestore';
import './BreathingTool.css';

// Speech helper (browser TTS)
const speak=(text, priority=false)=>{
  try{
    if(priority){window.speechSynthesis.cancel();}
    const u=new SpeechSynthesisUtterance(text);
    u.rate=0.85;
    u.pitch=1;
    u.volume=0.8;
    window.speechSynthesis.speak(u);
  }catch(e){
    console.log('TTS not available:', e);
  }
};

// Enhanced rules-based recommendation
const makeRecommendation=({cycles,inhale,hold,exhale,moodBefore,moodAfter})=>{
  const delta=(moodAfter??0)-(moodBefore??0);
  const lengthSec=cycles*(inhale+hold+exhale);
  const tips=[];

  // Breathing pattern analysis
  if(inhale<4||exhale<4){
    tips.push('Try longer, slower breaths (4-6 seconds) for deeper relaxation.');
  }
  if(exhale<inhale){
    tips.push('Make exhale longer than inhale to activate the parasympathetic nervous system.');
  }
  if(hold>0&&hold>inhale){
    tips.push('Consider reducing hold time - focus on smooth inhale/exhale flow.');
  }

  // Session duration analysis
  if(lengthSec<120){
    tips.push('Longer sessions (3-5 minutes) often provide more noticeable benefits.');
  }

  // Mood-based recommendations
  if(delta<=0){
    tips.push('Try box breathing (4-4-4-4) or extend exhale to 6-8 seconds.');
    tips.push('Consider combining with progressive muscle relaxation.');
  }
  if(delta>0){
    tips.push('Great progress! Continue with this pattern and gradually increase duration.');
  }

  // Pattern-specific advice
  if(inhale===exhale&&hold===0){
    tips.push('Box breathing (equal inhale/hold/exhale/pause) is excellent for focus.');
  }

  const summary=`Session: ${cycles} cycles @ ${inhale}-${hold}-${exhale}s. Mood change: ${delta>0?`+${delta}`:delta}. Duration: ${Math.round(lengthSec/60)}min ${lengthSec%60}s.`;
  return {summary,tips,delta,lengthSec};
};

const Phase={Inhale:'inhale',Hold:'hold',Exhale:'exhale',Idle:'idle',Complete:'complete'};

const BreathingTool=({defaultInhale=4,defaultHold=4,defaultExhale=6,defaultCycles=6})=>{
  const auth=getAuth();
  const db=getFirestore();

  // UI/Config
  const [inhale,setInhale]=useState(defaultInhale);
  const [hold,setHold]=useState(defaultHold);
  const [exhale,setExhale]=useState(defaultExhale);
  const [cycles,setCycles]=useState(defaultCycles);

  // Mood tracking - now only after session
  const [moodBefore,setMoodBefore]=useState(5);
  const [moodAfter,setMoodAfter]=useState(5);
  const [showMoodAfter,setShowMoodAfter]=useState(false);

  // Session state
  const [phase,setPhase]=useState(Phase.Idle);
  const [currentCycle,setCurrentCycle]=useState(0);
  const [secondsLeft,setSecondsLeft]=useState(0);
  const [running,setRunning]=useState(false);
  const [startedAt,setStartedAt]=useState(null);
  const [endedAt,setEndedAt]=useState(null);
  const [saving,setSaving]=useState(false);
  const [lastRecommendation,setLastRecommendation]=useState(null);
  const [voiceEnabled,setVoiceEnabled]=useState(true);
  const tickRef=useRef(null);
  const circleRef=useRef(null);

  // Calculate progress for visual feedback
  const sessionProgress=useMemo(()=>{
    if(!startedAt||phase===Phase.Idle)return 0;
    const totalDuration=cycles*(inhale+hold+exhale);
    const elapsed=running?(new Date()-startedAt)/1000:0;
    return Math.min((elapsed/totalDuration)*100,100);
  },[running,startedAt,cycles,inhale,hold,exhale,phase]);

  const maxRadius=useMemo(()=>120,[]);
  const radius=useMemo(()=>{
    if(!running||phase===Phase.Idle)return 40;
    if(phase===Phase.Complete)return maxRadius;

    const total=phase===Phase.Inhale?inhale:phase===Phase.Hold?hold:exhale;
    const progress=total>0?1-(secondsLeft/total):0;

    if(phase===Phase.Inhale){return 40+(maxRadius-40)*progress;}
    if(phase===Phase.Hold){return maxRadius;}
    if(phase===Phase.Exhale){return maxRadius-(maxRadius-40)*progress;}
    return 40;
  },[running,phase,secondsLeft,inhale,hold,exhale,maxRadius]);

  const nextPhase=useCallback(()=> {
    if(phase===Phase.Idle){
      setPhase(Phase.Inhale);
      setSecondsLeft(inhale);
      if(voiceEnabled)speak('Inhale slowly', true);
      return;
    }
    if(phase===Phase.Inhale){
      setPhase(hold>0?Phase.Hold:Phase.Exhale);
      setSecondsLeft(hold>0?hold:exhale);
      if(voiceEnabled)speak(hold>0?'Hold your breath comfortably':'Exhale slowly', true);
      return;
    }
    if(phase===Phase.Hold){
      setPhase(Phase.Exhale);
      setSecondsLeft(exhale);
      if(voiceEnabled)speak('Exhale slowly', true);
      return;
    }
    if(phase===Phase.Exhale){
      const next=currentCycle+1;
      if(next>=cycles){
        setRunning(false);
        setPhase(Phase.Complete);
        setEndedAt(new Date());
        if(voiceEnabled)speak('Session complete. Take a moment to notice how you feel.', true);
        setTimeout(()=>setShowMoodAfter(true),2000);
        return;
      }
      setCurrentCycle(next);
      setPhase(Phase.Inhale);
      setSecondsLeft(inhale);
      if(voiceEnabled)speak('Inhale slowly', true);
      return;
    }
  },[phase,inhale,hold,exhale,voiceEnabled,currentCycle,cycles]);

  const startSession=()=> {
    if(!auth.currentUser){
      alert('Please sign in to start a breathing session.');
      return;
    }
    setStartedAt(new Date());
    setEndedAt(null);
    setCurrentCycle(0);
    setPhase(Phase.Inhale);
    setSecondsLeft(inhale);
    setRunning(true);
    setShowMoodAfter(false);
    setLastRecommendation(null);
    if(voiceEnabled)speak('Starting breathing session. Inhale slowly.', true);
  };

  const pauseSession=()=> {
    setRunning(false);
    if(voiceEnabled)speak('Paused', true);
  };

  const resumeSession=()=> {
    if(phase===Phase.Idle){nextPhase();}
    setRunning(true);
    if(voiceEnabled)speak('Resuming', true);
  };

  const stopSession=()=> {
    setRunning(false);
    setPhase(Phase.Idle);
    setSecondsLeft(0);
    setEndedAt(new Date());
    if(voiceEnabled)speak('Session stopped', true);
  };

  const resetSession=()=> {
    setRunning(false);
    setPhase(Phase.Idle);
    setSecondsLeft(0);
    setCurrentCycle(0);
    setStartedAt(null);
    setEndedAt(null);
    setShowMoodAfter(false);
    setLastRecommendation(null);
    if(voiceEnabled)speak('Session reset', true);
  };

  // Timer effect
  useEffect(()=> {
    if(!running){
      if(tickRef.current){clearInterval(tickRef.current);tickRef.current=null;}
      return;
    }
    tickRef.current=setInterval(()=> {
      setSecondsLeft((s)=>{
        const next=s-1;
        if(next<=0){nextPhase();return 0;}
        return next;
      });
    },1000);
    return ()=>{if(tickRef.current){clearInterval(tickRef.current);tickRef.current=null;}};
  },[running,phase,nextPhase]);

  // Auto-save when finished
  useEffect(()=> {
    const completed=!running&&startedAt&&endedAt&&phase===Phase.Complete;
    if(!completed)return;

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
          tool:'breathing_v2',
          voiceEnabled
        });
      }catch(e){
        console.error('Save failed:',e);
      }finally{
        setSaving(false);
      }
    };
    doSave();
  },[running,phase,startedAt,endedAt,auth.currentUser?.uid,currentCycle,db,exhale,hold,inhale,moodAfter,moodBefore,voiceEnabled]);

  const canStart=useMemo(()=>!running&&phase===Phase.Idle,[running,phase]);
  const canPause=useMemo(()=>running&&phase!==Phase.Idle,[running,phase]);
  const canResume=useMemo(()=>!running&&phase!==Phase.Idle&&phase!==Phase.Complete,[running,phase]);
  const canStop=useMemo(() => running || phase !== Phase.Idle, [running, phase]);
  const canReset=useMemo(() => phase === Phase.Complete || (!running && phase !== Phase.Idle), [running, phase]);

  const phaseLabel=useMemo(()=>{
    if(phase===Phase.Inhale)return 'Inhale';
    if(phase===Phase.Hold)return 'Hold';
    if(phase===Phase.Exhale)return 'Exhale';
    if(phase===Phase.Complete)return 'Complete';
    return 'Ready';
  },[phase]);

  const instructionText=useMemo(()=>{
    if(phase===Phase.Idle)return 'Configure your breathing pattern and click Start';
    if(phase===Phase.Complete)return 'Great job! How do you feel now?';
    if(phase===Phase.Inhale)return 'Breathe in slowly through your nose';
    if(phase===Phase.Hold)return 'Hold your breath comfortably';
    if(phase===Phase.Exhale)return 'Exhale slowly through your mouth';
    return '';
  },[phase]);

  return (
    <div className="breathing-tool">
      <div className="breathing-tool-header">
        <h2>Mindful Breathing</h2>
        <p>A guided breathing exercise to help you find calm and focus</p>
      </div>

      {/* Configuration Section */}
      <div className="breathing-config-section">
        <div className="breathing-config-grid">
          <div className="config-group">
            <label className="config-label">Inhale (seconds)</label>
            <input
              type="number"
              min="2"
              max="10"
              value={inhale}
              onChange={(e)=>setInhale(parseInt(e.target.value||'0',10))}
              className="config-input"
              disabled={running}
            />
          </div>
          <div className="config-group">
            <label className="config-label">Hold (seconds)</label>
            <input
              type="number"
              min="0"
              max="10"
              value={hold}
              onChange={(e)=>setHold(parseInt(e.target.value||'0',10))}
              className="config-input"
              disabled={running}
            />
          </div>
          <div className="config-group">
            <label className="config-label">Exhale (seconds)</label>
            <input
              type="number"
              min="3"
              max="12"
              value={exhale}
              onChange={(e)=>setExhale(parseInt(e.target.value||'0',10))}
              className="config-input"
              disabled={running}
            />
          </div>
          <div className="config-group">
            <label className="config-label">Cycles</label>
            <input
              type="number"
              min="1"
              max="20"
              value={cycles}
              onChange={(e)=>setCycles(parseInt(e.target.value||'0',10))}
              className="config-input"
              disabled={running}
            />
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'16px'}}>
          <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e)=>setVoiceEnabled(e.target.checked)}
            />
            <span style={{fontSize:'0.9rem',color:'#495057'}}>Voice guidance</span>
          </label>
        </div>
      </div>

      {/* Mood Before Section */}
      {phase===Phase.Idle&&(
        <div className="mood-section">
          <div className="mood-grid">
            <div className="mood-input-group">
              <label className="mood-label">How are you feeling right now? (1-10)</label>
              <div className="mood-slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e)=>setMoodBefore(parseInt(e.target.value,10))}
                  className="mood-slider"
                />
                <div className="mood-value">{moodBefore}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood After Section */}
      {showMoodAfter&&(
        <div className="mood-section">
          <div className="mood-grid">
            <div className="mood-input-group">
              <label className="mood-label">How do you feel now? (1-10)</label>
              <div className="mood-slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodAfter}
                  onChange={(e)=>setMoodAfter(parseInt(e.target.value,10))}
                  className="mood-slider"
                />
                <div className="mood-value">{moodAfter}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Progress */}
      {running&&(
        <div className="progress-bar">
          <div className="progress-fill" style={{width:`${sessionProgress}%`}}></div>
        </div>
      )}

      {/* Breathing Visualization */}
      <div className="breathing-visualization">
        <div className="breathing-circle-container">
          <svg width="320" height="320" viewBox="0 0 320 320" className={`phase-${phase.toLowerCase()}`}>
            <circle cx="160" cy="160" r="130" className="breathing-circle-bg" />
            <circle
              ref={circleRef}
              cx="160"
              cy="160"
              r={radius}
              className={`breathing-circle ${running?'pulsing':''}`}
            />
            <text x="160" y="140" className="breathing-text phase-text">{phaseLabel}</text>
            <text x="160" y="165" className="breathing-text timer-text">
              {secondsLeft>0?`${secondsLeft}s`:phase===Phase.Complete?'✓':''}
            </text>
            <text x="160" y="190" className="breathing-text cycle-text">
              {phase!==Phase.Idle?`Cycle ${Math.min(currentCycle+1,cycles)} / ${cycles}`:''}
            </text>
          </svg>
        </div>
      </div>

      {/* Instructions */}
      <div className="instruction-text">{instructionText}</div>

      {/* Controls */}
      <div className="breathing-controls">
        {canStart&&<button onClick={startSession} className="breathing-btn btn-primary">Start Session</button>}
        {canPause&&<button onClick={pauseSession} className="breathing-btn btn-secondary">Pause</button>}
        {canResume&&<button onClick={resumeSession} className="breathing-btn btn-success">Resume</button>}
        {canStop&&<button onClick={stopSession} className="breathing-btn btn-danger">Stop</button>}
        {canReset&&<button onClick={resetSession} className="breathing-btn btn-outline">Reset</button>}
      </div>

      {/* Session Info */}
      {(running||phase!==Phase.Idle)&&(
        <div className="session-info">
          <div className="session-stats">
            <div className="stat-item">
              <div className="stat-label">Cycle</div>
              <div className="stat-value">{currentCycle+1}/{cycles}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Pattern</div>
              <div className="stat-value">{inhale}-{hold}-{exhale}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Progress</div>
              <div className="stat-value">{Math.round(sessionProgress)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Notice */}
      {voiceEnabled&&(
        <div className="voice-notice">
          <strong>Voice Guidance:</strong> Make sure your device volume is on. Voice instructions will guide your breathing.
        </div>
      )}

      {/* Recommendation */}
      {lastRecommendation&&(
        <div className="recommendation-card">
          <div className="recommendation-header">Session Summary & Recommendations</div>
          <div className="recommendation-summary">{lastRecommendation.summary}</div>
          <ul className="recommendation-tips">
            {lastRecommendation.tips.map((tip,i)=>(
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {saving&&<div className="saving-indicator">Saving your session...</div>}
    </div>
  );
};

export default BreathingTool;