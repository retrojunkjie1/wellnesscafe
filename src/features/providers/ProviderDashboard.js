import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../../styles/providers.css';

const ProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const unsub = auth?.onAuthStateChanged((u) => setUser(u || null));
    return () => unsub && unsub();
  }, [])npm run build && npx serve -s build -l 65191;

  useEffect(() => {
    const fetchProvider = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'providers'),
          where('ownerUid', '==', user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProvider({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error('Error fetching provider:', err);
      }
      setLoading(false);
    };
    fetchProvider();
  }, [user]);

  const generateHTML = () => {
    if (!provider) return '';
    const avatar = provider.fullName?.charAt(0) || 'W';
    const services = provider.serviceTypes?.map(s => `<span class="chip">${s}</span>`).join('') || '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${provider.fullName || 'Provider'} - Wellness Professional</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;background:linear-gradient(135deg,#1f2937 0%,#111827 100%);color:#fff;padding:40px 20px;min-height:100vh}
.container{max-width:900px;margin:0 auto;background:rgba(31,41,55,0.9);border-radius:24px;padding:48px;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid rgba(122,90,248,0.3);position:relative}
.container::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent 0%,rgba(122,90,248,0.8) 20%,rgba(177,156,255,0.8) 50%,rgba(212,180,131,0.6) 80%,transparent 100%)}
.header{display:flex;align-items:center;gap:24px;margin-bottom:40px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.1)}
.avatar{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,rgba(122,90,248,0.8),rgba(177,156,255,0.8));display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:700;color:#fff;border:3px solid rgba(255,255,255,0.1);box-shadow:0 8px 24px rgba(122,90,248,0.4)}
h1{font-size:2.5rem;font-weight:700;margin-bottom:8px;background:linear-gradient(135deg,#fff 0%,#f0e5d8 40%,#e6d7ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.role{font-size:1.25rem;color:#b19cff;font-weight:600;margin-bottom:8px}
.location{font-size:1rem;color:rgba(255,255,255,0.6)}
.services{display:flex;flex-wrap:wrap;gap:12px;margin:32px 0}
.chip{padding:8px 16px;background:rgba(122,90,248,0.2);border:1px solid rgba(122,90,248,0.4);border-radius:20px;color:#b19cff;font-size:0.9rem;font-weight:500}
.section{margin-bottom:32px}
.section h2{font-size:1.5rem;font-weight:700;color:rgba(255,255,255,0.95);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid rgba(122,90,248,0.3)}
.section p{font-size:1.05rem;line-height:1.8;color:rgba(255,255,255,0.75)}
.info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;margin-bottom:32px}
.info-item{background:rgba(45,45,55,0.6);padding:20px;border-radius:12px;border:1px solid rgba(122,90,248,0.2)}
.info-label{font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em}
.info-value{font-size:1.25rem;font-weight:700;color:#b19cff}
.rate{color:#d4b483}
.cta-button{display:inline-block;padding:16px 32px;background:linear-gradient(135deg,rgba(122,90,248,0.9),rgba(177,156,255,0.9));color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:1.1rem;border:1px solid rgba(122,90,248,0.6);box-shadow:0 8px 24px rgba(122,90,248,0.4)}
.footer{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;color:rgba(255,255,255,0.5);font-size:0.9rem}
.powered-by{margin-top:16px;font-size:0.85rem}
.powered-by a{color:#b19cff;text-decoration:none;font-weight:600}
@media(max-width:768px){.container{padding:32px 24px}.header{flex-direction:column;text-align:center}h1{font-size:2rem}.info-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="avatar">${avatar}</div>
<div>
<h1>${provider.fullName || 'Wellness Professional'}</h1>
<div class="role">${provider.role || 'Provider'}</div>
<div class="location">${provider.city || ''}${provider.city && provider.country ? ', ' : ''}${provider.country || ''}</div>
</div>
</div>
${services ? `<div class="services">${services}</div>` : ''}
<div class="info-grid">
<div class="info-item"><div class="info-label">Experience</div><div class="info-value">${provider.years || 0} Years</div></div>
<div class="info-item"><div class="info-label">Rate</div><div class="info-value rate">$${provider.ratePerHour || 0}/hr</div></div>
${provider.meetingModes?.length ? `<div class="info-item"><div class="info-label">Meeting Modes</div><div class="info-value">${provider.meetingModes.join(', ')}</div></div>` : ''}
</div>
${provider.bio ? `<div class="section"><h2>About</h2><p>${provider.bio}</p></div>` : ''}
${provider.certifications ? `<div class="section"><h2>Certifications</h2><p>${provider.certifications}</p></div>` : ''}
${provider.calendarUrl ? `<div class="section"><h2>Book a Session</h2><a href="${provider.calendarUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">Schedule Appointment</a></div>` : ''}
<div class="footer"><p>Professional wellness services with care and confidentiality.</p><div class="powered-by">Powered by <a href="https://wellnesscafelanding.web.app" target="_blank">WellnessCafe</a></div></div>
</div>
</body>
</html>`;
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${provider.fullName?.replace(/\s+/g, '-') || 'provider'}-profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => {
      alert('Profile HTML copied! Paste into any HTML file or website builder.');
    });
  };

  if (loading) return <section className="pv-wrap"><div className="pv-loading">Loading...</div></section>;
  if (!user) return <section className="pv-wrap"><h1 className="pv-title">Provider Dashboard</h1><p className="pv-sub">Please sign in.</p></section>;
  if (!provider) return <section className="pv-wrap"><h1 className="pv-title">Provider Dashboard</h1><p className="pv-sub">You haven't registered as a provider yet.</p><a href="/providers/apply" className="pv-solid" style={{display:'inline-block',marginTop:'2rem',textDecoration:'none'}}>Apply Now</a></section>;

  return (
    <section className="pv-wrap">
      <div className="pv-header-row">
        <div><h1 className="pv-title">My Provider Dashboard</h1><p className="pv-sub">Manage your profile and share it with clients</p></div>
      </div>
      <div className="pv-card" style={{marginBottom:'2rem'}}>
        <div className="pv-card-head">
          <div className="pv-avatar">{provider.fullName?.charAt(0) || 'W'}</div>
          <div><h3 className="pv-name">{provider.fullName}</h3><div className="pv-role">{provider.role}</div></div>
        </div>
        {provider.serviceTypes?.length > 0 && <div className="pv-services">{provider.serviceTypes.map((s,i)=><span key={i} className="chip small">{s}</span>)}</div>}
        <p className="pv-bio">{provider.bio || 'No bio yet.'}</p>
        <div className="pv-meta"><span>{provider.city}, {provider.country}</span><span className="pv-rate">${provider.ratePerHour}/hr</span></div>
        <div className="pv-status">Status: <strong>{provider.verificationStatus || 'pending_review'}</strong> • Verified: <strong>{provider.verified ? 'Yes' : 'No'}</strong></div>
      </div>
      <div style={{background:'rgba(122,90,248,0.1)',padding:'2rem',borderRadius:'20px',border:'1px solid rgba(122,90,248,0.3)',marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.75rem',fontWeight:'700',marginBottom:'1rem',background:'linear-gradient(135deg,#ffffff 0%,#f0e5d8 40%,#e6d7ff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>🆓 FREE Profile Sharing</h2>
        <p style={{color:'rgba(255,255,255,0.75)',marginBottom:'1.5rem',lineHeight:'1.6'}}>Download your profile as HTML or copy the code to share on your website. <strong style={{color:'#b19cff'}}>Completely free!</strong></p>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          <button onClick={downloadHTML} className="pv-solid">📥 Download HTML</button>
          <button onClick={copyHTML} className="pv-ghost">📋 Copy HTML</button>
          <button onClick={()=>setShowPreview(!showPreview)} className="pv-ghost">👁️ {showPreview?'Hide':'Preview'}</button>
        </div>
      </div>
      {showPreview && <div style={{background:'rgba(31,41,55,0.8)',padding:'2rem',borderRadius:'20px',border:'1px solid rgba(122,90,248,0.3)',marginBottom:'2rem'}}><h3 style={{fontSize:'1.35rem',fontWeight:'700',marginBottom:'1rem',color:'rgba(255,255,255,0.95)'}}>Profile Preview</h3><div style={{background:'white',borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}><iframe srcDoc={generateHTML()} style={{width:'100%',height:'600px',border:'none',borderRadius:'12px'}} title="Preview"/></div></div>}
      <div className="pv-grid">
        <div style={{background:'rgba(31,41,55,0.8)',padding:'1.5rem',borderRadius:'16px',border:'1px solid rgba(122,90,248,0.3)'}}><div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem'}}>EXPERIENCE</div><div style={{fontSize:'1.5rem',fontWeight:'700',color:'#b19cff'}}>{provider.years||0} Years</div></div>
        <div style={{background:'rgba(31,41,55,0.8)',padding:'1.5rem',borderRadius:'16px',border:'1px solid rgba(122,90,248,0.3)'}}><div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem'}}>SERVICES</div><div style={{fontSize:'1.5rem',fontWeight:'700',color:'#b19cff'}}>{provider.serviceTypes?.length||0}</div></div>
        <div style={{background:'rgba(31,41,55,0.8)',padding:'1.5rem',borderRadius:'16px',border:'1px solid rgba(122,90,248,0.3)'}}><div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem'}}>RATE</div><div style={{fontSize:'1.5rem',fontWeight:'700',color:'#d4b483'}}>${provider.ratePerHour||0}</div></div>
      </div>
    </section>
  );
};

export default ProviderDashboard;
