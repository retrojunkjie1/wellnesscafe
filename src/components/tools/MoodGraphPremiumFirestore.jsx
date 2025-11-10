import React,{useEffect,useMemo,useState} from "react";
import {Sparkles,Tag,TrendingUp,Calendar,Save,BarChart3,Heart,Award,Flame,Zap} from "lucide-react";
import {AreaChart,Area,BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from "recharts";
import {db} from "../../firebase";
import {collection,addDoc,query,orderBy,limit,onSnapshot,serverTimestamp,getDocs} from "firebase/firestore";

const MOODS=[
  {key:"Joy",emoji:"😄",score:9,color:"from-yellow-400 to-orange-400"},
  {key:"Calm",emoji:"😌",score:7,color:"from-blue-400 to-cyan-400"},
  {key:"Neutral",emoji:"😐",score:5,color:"from-gray-400 to-slate-400"},
  {key:"Anxious",emoji:"😰",score:3,color:"from-red-400 to-orange-400"},
  {key:"Sad",emoji:"😢",score:2,color:"from-indigo-400 to-blue-400"},
  {key:"Angry",emoji:"😡",score:1,color:"from-red-600 to-pink-600"},
  {key:"Grateful",emoji:"🙏",score:8,color:"from-green-400 to-emerald-400"},
  {key:"Inspired",emoji:"✨",score:8,color:"from-purple-400 to-pink-400"}
];

const TRIGGERS=["Work","Relationships","Health","Finances","Sleep","Recovery","Routine","Nature","Social","Boundaries"];
const todayKey=()=>new Date().toISOString().slice(0,10);

// Fallback seed for showcase (used only if Firestore returns 0 docs on first load)
const SEED_ROWS=[
  {date:"2025-11-09",mood:"Calm",emoji:"😌",score:7,intensity:6,note:"Good morning meditation",tags:["Routine","Sleep"]},
  {date:"2025-11-08",mood:"Grateful",emoji:"🙏",score:8,intensity:8,note:"Connected with loved ones",tags:["Relationships","Social"]},
  {date:"2025-11-07",mood:"Joy",emoji:"😄",score:9,intensity:9,note:"Completed workout goals",tags:["Health","Routine"]}
];

export default function MoodGraphPremiumFirestore(){
  const [dateKey] = useState(todayKey());
  const [mood,setMood] = useState(MOODS[1]);
  const [intensity,setIntensity] = useState(6);
  const [note,setNote] = useState("");
  const [tags,setTags] = useState(["Routine"]);
  const [saving,setSaving] = useState(false);
  const [rows,setRows] = useState([]);

  // ---------- Firestore: realtime load with graceful fallback ----------
  useEffect(()=>{
    const q=query(collection(db,"moods"),orderBy("createdAt","desc"),limit(60));
    const unsub=onSnapshot(q,(snap)=>{
      if(snap.empty && rows.length===0){
        setRows(SEED_ROWS);
        return;
      }
      const data=snap.docs.map((d)=>({id:d.id,...d.data(),date:normalizeDate(d.data())}));
      setRows(data);
    },(err)=>{
      console.error("moods:onSnapshot",err);
      if(rows.length===0)setRows(SEED_ROWS);
    });
    return ()=>unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const toggleTag=(t)=>setTags((arr)=>arr.includes(t)?arr.filter((x)=>x!==t):[...arr,t]);

  const save=async()=>{
    setSaving(true);
    try{
      await addDoc(collection(db,"moods"),{
        date:dateKey,
        mood:mood.key,
        emoji:mood.emoji,
        score:mood.score,
        intensity,
        note,
        tags,
        createdAt:serverTimestamp()
      });
      setNote(""); setTags(["Routine"]); setIntensity(6);
    }catch(e){ console.error("moods:addDoc",e); }
    setSaving(false);
  };

  // ---------- Analytics ----------
  const stats=useMemo(()=>{
    if(rows.length===0)return {avgScore:"0.0",topMood:"—",streak:0,maxIntensity:0,total:0};
    const counts={}; let totalScore=0; let maxInt=0;
    rows.forEach((r)=>{ totalScore+=(r.score||0); maxInt=Math.max(maxInt,r.intensity||0); counts[r.mood]=(counts[r.mood]||0)+1; });
    const topMood=(Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]||["—"])[0];
    return {avgScore:(totalScore/rows.length).toFixed(1),topMood,streak:calcStreak(rows),maxIntensity:maxInt,total:rows.length};
  },[rows]);

  const trend14=useMemo(()=>{
    const last14=[...rows].reverse().slice(-14);
    return last14.map((r,i)=>({name:`D${last14.length-i}`,score:r.score||0,intensity:r.intensity||0}));
  },[rows]);

  const freqData=useMemo(()=>{
    const counts=MOODS.reduce((m,o)=>{m[o.key]=0; return m;}, {});
    rows.forEach((r)=>{ if(counts[r.mood]!=null)counts[r.mood]+=1; });
    return MOODS.map((m)=>({name:m.emoji,count:counts[m.key]||0}));
  },[rows]);

  const insight=useMemo(()=>buildWeeklyInsight(rows),[rows]);

  return(
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-700"/>
        <svg className="absolute top-0 w-full h-96 opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <animate attributeName="x" from="0" to="-720" dur="20s" repeatCount="indefinite"/>
          <path fill="#fbbf24" fillOpacity="0.15" d="M0,64L48,69.3C96,75,192,85,288,122.7C384,160,480,224,576,245.3C672,267,768,245,864,208C960,171,1056,117,1152,85.3C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0,480,0,384,0,288,0,192,0,96,0,48,0L0,0Z"/>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <BarChart3 className="text-white" size={24}/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400">Mood Graph</h1>
              <p className="text-xs text-gray-400">Track emotions • Note triggers • See patterns</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-4 gap-6 text-sm">
            <Metric title="AVG MOOD" value={stats.avgScore}/>
            <div className="h-12 w-px bg-amber-400/20"/>
            <Metric title="TOP MOOD" value={stats.topMood}/>
            <Metric title="STREAK" value={`${stats.streak}d`}/>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mood entry + tags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-amber-400/30 p-8 backdrop-blur overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <div className="relative space-y-8">
              <div>
                <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6"><Sparkles size={20}/> How are you feeling?</h2>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {MOODS.map((m)=>(
                    <button key={m.key} onClick={()=>setMood(m)} className={`p-3 rounded-xl border-2 transition-all hover:scale-110 ${mood.key===m.key?`border-amber-400 bg-gradient-to-br ${m.color} shadow-lg shadow-amber-500/50`:"border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <div className="text-3xl">{m.emoji}</div>
                      <div className="text-[10px] text-gray-300 mt-1 font-semibold">{m.key}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-amber-300">Intensity Level</label>
                  <span className="text-3xl font-bold text-white">{intensity}</span>
                </div>
                <input type="range" min={1} max={10} value={intensity} onChange={(e)=>setIntensity(parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                <div className="flex justify-between text-xs text-gray-400 mt-2"><span>Mild</span><span>Intense</span></div>
              </div>
              <div>
                <label className="text-sm font-semibold text-amber-300 block mb-3">What influenced this?</label>
                <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Describe what led to this mood. Be specific and honest..." className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-400/50 text-white placeholder-gray-500 resize-none"/>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-amber-400/30 p-8 backdrop-blur space-y-6">
            <div>
              <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-4"><Tag size={20}/> Triggers</h2>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t)=>(
                  <button key={t} onClick={()=>toggleTag(t)} className={`text-xs px-3 py-2 rounded-lg font-semibold border-2 transition-all ${tags.includes(t)?"bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-amber-400 text-amber-200":"bg-white/5 border-white/10 text-gray-300 hover:border-white/20"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"/>
            <div>
              <p className="text-sm text-gray-400 mb-3"><Calendar size={14} className="inline mr-2"/>{dateKey}</p>
              <button onClick={save} disabled={saving} className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-sm font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={18}/>{saving?"Saving...":"Save Entry"}
              </button>
            </div>
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 text-sm text-amber-100">
              <p className="font-semibold mb-2">💡 Tip</p>
              <p className="text-xs">Regular mood tracking helps identify patterns and triggers for better emotional awareness.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={<Flame size={14}/>} title="Peak Intensity" value={stats.maxIntensity}/>
          <StatCard icon={<Award size={14}/>} title="Total Entries" value={stats.total}/>
          <StatCard icon={<TrendingUp size={14}/>} title="Trend" value="↑"/>
          <StatCard icon={<Zap size={14}/>} title="This Month" value={countThisMonth(rows)}/>
        </div>

        {/* Charts */}
        {rows.length>0&&(
          <div>
            <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2 mb-8"><TrendingUp size={24}/> Analytics & Patterns</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6"><TrendingUp size={20}/> 14-Day Mood Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend14}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a"/>
                      <XAxis dataKey="name" stroke="#888"/><YAxis domain={[0,10]} stroke="#888"/>
                      <Tooltip contentStyle={{background:"#111",border:"1px solid #2a2a2a",borderRadius:"8px",color:"#fff"}}/>
                      <Area type="monotone" dataKey="score" stroke="#fbbf24" fillOpacity={1} fill="url(#colorScore)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6"><BarChart3 size={20}/> Mood Frequency</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={freqData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a"/>
                      <XAxis dataKey="name" stroke="#888"/><YAxis allowDecimals={false} stroke="#888"/>
                      <Tooltip contentStyle={{background:"#111",border:"1px solid #2a2a2a",borderRadius:"8px"}}/>
                      <Bar dataKey="count" fill="#fbbf24" radius={[8,8,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI-style weekly insight (below charts) */}
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-3"><Heart size={20}/> Weekly Insight</h3>
              <p className="text-sm text-amber-100/90 leading-relaxed">{insight.message}</p>
              {insight.tips.length>0&&(
                <ul className="mt-4 text-xs text-amber-100/80 list-disc pl-5 space-y-1">
                  {insight.tips.map((t,i)=><li key={i}>{t}</li>)}
                </ul>
              )}
            </div>

            {/* Recent entries */}
            <div className="mt-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6"><Heart size={20}/> Recent Entries</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rows.slice(0,12).map((entry,idx)=>(
                  <div key={idx} className="p-4 bg-black/30 border border-white/10 rounded-xl hover:border-amber-400/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{entry.emoji}</span>
                        <div>
                          <p className="font-bold text-white">{entry.mood}</p>
                          <p className="text-xs text-gray-400">{entry.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-400">Intensity: {entry.intensity||0}/10</p>
                        <p className="text-xs text-gray-400">Score: {entry.score||0}</p>
                      </div>
                    </div>
                    {entry.note&&(<p className="text-sm text-gray-300 mb-3 italic">"{entry.note}"</p>)}
                    {entry.tags&&entry.tags.length>0&&(
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag,tidx)=>(
                          <span key={tidx} className="text-xs px-2 py-1 rounded-md bg-amber-500/20 text-amber-200">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({title,value}){
  return(
    <div className="text-center">
      <p className="text-gray-400 text-xs mb-1">{title}</p>
      <p className="text-2xl font-bold text-amber-400">{value}</p>
    </div>
  );
}

function StatCard({icon,title,value}){
  return(
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-6 backdrop-blur">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">{icon}{title}</p>
      <p className="text-3xl font-bold text-amber-400">{value}</p>
    </div>
  );
}

// ---------- helpers ----------
function normalizeDate(d){
  if(d?.date)return d.date;
  if(d?.createdAt?.seconds){
    const iso=new Date(d.createdAt.seconds*1000).toISOString().slice(0,10);
    return iso;
  }
  return todayKey();
}

function calcStreak(rows){
  const set=new Set(rows.map((r)=>r.date||todayKey()));
  let s=0;
  for(let i=0;i<90;i++){
    const d=new Date(); d.setDate(d.getDate()-i);
    const key=d.toISOString().slice(0,10);
    if(set.has(key))s++; else break;
  }
  return s;
}

function countThisMonth(rows){
  const now=new Date(); const ym=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  return rows.filter((r)=> (r.date||"").startsWith(ym)).length;
}

// Build weekly insight from last 7 entries
function buildWeeklyInsight(rows){
  const last7=[...rows].slice(0,7); // rows already desc
  if(last7.length===0)return {message:"No entries yet. Track your mood to unlock insights.",tips:[]};

  // mood frequency
  const counts={}; const triggerCounts={}; let avg=0; let maxInt=0;
  const weekdayCounts=[0,0,0,0,0,0,0];
  last7.forEach((r)=>{
    counts[r.mood]=(counts[r.mood]||0)+1;
    avg+=r.score||0;
    maxInt=Math.max(maxInt,r.intensity||0);
    (r.tags||[]).forEach((t)=>{triggerCounts[t]=(triggerCounts[t]||0)+1;});
    const wd=new Date(r.date||Date.now()).getDay(); // 0=Sun..6=Sat
    weekdayCounts[wd]+=1;
  });
  const topMood=(Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]||["—"])[0];
  const topTrigger=(Object.entries(triggerCounts).sort((a,b)=>b[1]-a[1])[0]||["—"])[0];
  const avgScore=(avg/last7.length).toFixed(1);
  const bestDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][weekdayCounts.indexOf(Math.max(...weekdayCounts))];

  const message=`This week leans toward ${topMood.toLowerCase()} with an average mood score of ${avgScore}. Peak intensity reached ${maxInt}/10. Your most common trigger appears to be "${topTrigger}". You logged the most entries on ${bestDay}. Keep tracking to sharpen these patterns.`;
  const tips=[
    topTrigger!=="—"?`Plan a 5-minute buffer before known "${topTrigger}" contexts (box-breath 4-4-4-4).`:`Add a few tags to expose repeat triggers.`,
    avgScore<6?`Aim for two "restore" reps tomorrow (walk + hydrate).`:`Maintain momentum with a 10-minute gratitude or nature block.`,
    `On ${bestDay}, schedule a micro-reward to reinforce consistency.`
  ];
  return {message,tips};
}
