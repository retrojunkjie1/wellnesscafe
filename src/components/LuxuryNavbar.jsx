// src/components/LuxuryNavbar.jsx
import React,{useEffect,useState} from "react";
import "./LuxuryNavbar.css";

const NAV_SECTIONS=[
  {
    key:"recovery",
    label:"Recovery",
    align:"center",
    mega:{
      quickLinks:[
        {label:"AI-Powered Recovery",href:"/recovery/ai"},
        {label:"Sobriety Dashboard",href:"/recovery/dashboard"},
        {label:"Urge Surfing Lab",href:"/tools/urge-surfing"},
      ],
      featuredTools:[
        {
          label:"Trigger Tracker",
          href:"/tools/trigger-tracker",
          desc:"Map patterns, people, and places that spike your nervous system."
        },
        {
          label:"Daily Check-In",
          href:"/tools/check-in",
          desc:"Simple structured check-ins that keep you honest and grounded."
        }
      ],
      spotlight:{
        label:"Precision Recovery",
        desc:"A calm, data-aware recovery hub that learns your rhythms over time.",
        href:"/recovery"
      }
    }
  },
  {
    key:"tools",
    label:"Tools",
    align:"center",
    mega:{
      quickLinks:[
        {label:"Guided Mindfulness",href:"/tools/mindfulness"},
        {label:"Breathwork Studio",href:"/tools/breathwork"},
        {label:"Acuwellness",href:"/tools/acuwellness"},
      ],
      featuredTools:[
        {
          label:"Urge Surfing",
          href:"/tools/urge-surfing",
          desc:"Ride cravings like waves instead of letting them crash your day."
        },
        {
          label:"Affirmation Engine",
          href:"/tools/affirmations",
          desc:"AI-tuned affirmations matched to your current emotional state."
        }
      ],
      spotlight:{
        label:"Wellness Tools Board",
        desc:"One page where all your rituals, tools, and trackers live together.",
        href:"/tools"
      }
    }
  },
  {
    key:"providers",
    label:"Providers",
    align:"right",
    mega:{
      quickLinks:[
        {label:"Therapists",href:"/providers/therapists"},
        {label:"Sober Coaches",href:"/providers/coaches"},
        {label:"Spiritual Guides",href:"/providers/spiritual"},
        {label:"Clinics & Retreats",href:"/providers/clinics"},
      ],
      featuredTools:[
        {
          label:"Match With A Guide",
          href:"/providers/match",
          desc:"Answer a few questions and let the AI shortlist aligned providers."
        },
        {
          label:"Provider Marketplace",
          href:"/providers",
          desc:"Curated wellness professionals who understand recovery first."
        }
      ],
      spotlight:{
        label:"WellnessCafe Network",
        desc:"A global network of recovery-minded practitioners and spaces.",
        href:"/providers"
      }
    }
  }
];

const LuxuryNavbar=()=>{

  const [isMobileOpen,setIsMobileOpen]=useState(false);
  const [activeMega,setActiveMega]=useState(null);
  const [isScrolled,setIsScrolled]=useState(false);

  useEffect(()=>{
    const onScroll=()=>{
      if(window.scrollY>24){
        setIsScrolled(true);
        // Auto-close mega menu on scroll
        setActiveMega(null);
      }else{
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll",onScroll);
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  // Lock body scroll when mobile menu is open
  useEffect(()=>{
    if(isMobileOpen){
      document.body.style.overflow='hidden';
    }else{
      document.body.style.overflow='';
    }
    return ()=>{
      document.body.style.overflow='';
    };
  },[isMobileOpen]);

  const toggleMobileMenu=()=>{
    setIsMobileOpen((prev)=>!prev);
  };

  const handleMegaEnter=(key)=>{
    setActiveMega(key);
  };

  const handleMegaLeave=()=>{
    setActiveMega(null);
  };

  return (
    <header className={`wc-navbar ${isScrolled?"wc-navbar--scrolled":""}`}>
      <div className="wc-navbar-inner">
        {/* Brand */}
        <div className="wc-navbar-left">
          <a href="/" className="wc-brand">
            <span className="wc-brand-mark">WELLNESSCAFE</span>
            <span className="wc-brand-ripple">≋</span>
          </a>
        </div>

        {/* Desktop center nav */}
        <nav className="wc-navbar-center">
          <a href="/" className="wc-nav-link">Home</a>
          <a href="/news" className="wc-nav-link">News</a>

          {NAV_SECTIONS.map((section)=>(
            <div
              key={section.key}
              className={`wc-nav-item ${activeMega===section.key?"wc-nav-item--active":""}`}
              onMouseEnter={()=>handleMegaEnter(section.key)}
              onMouseLeave={handleMegaLeave}
            >
              <button className="wc-nav-link wc-nav-link--with-caret">
                <span>{section.label}</span>
                <span className="wc-caret">▾</span>
              </button>

              {/* Mega menu (desktop only via CSS) */}
              <div className={`wc-mega wc-mega-menu wc-mega--${section.align||"center"}`}>
                <div className="wc-mega-col wc-mega-col--quick">
                  <div className="wc-mega-label">Quick paths</div>
                  <ul>
                    {section.mega.quickLinks.map((item)=>(
                      <li key={item.href}>
                        <a href={item.href} className="wc-mega-link">{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="wc-mega-col wc-mega-col--featured">
                  <div className="wc-mega-label">Featured tools</div>
                  {section.mega.featuredTools.map((item)=>(
                    <a key={item.href} href={item.href} className="wc-mega-card">
                      <div className="wc-mega-card-title">{item.label}</div>
                      <div className="wc-mega-card-desc">{item.desc}</div>
                    </a>
                  ))}
                </div>

                <div className="wc-mega-col wc-mega-col--spotlight">
                  <div className="wc-mega-spotlight">
                    <div className="wc-mega-spotlight-kicker">Spotlight</div>
                    <div className="wc-mega-spotlight-title">
                      {section.mega.spotlight.label}
                    </div>
                    <div className="wc-mega-spotlight-desc">
                      {section.mega.spotlight.desc}
                    </div>
                    <a href={section.mega.spotlight.href} className="wc-mega-spotlight-cta">
                      Enter space ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Right controls */}
        <div className="wc-navbar-right">
          <a href="/get-help" className="wc-cta-pill">
            <span>Get Help Now</span>
          </a>

          {/* Mobile hamburger */}
          <button
            className={`wc-burger ${isMobileOpen?"wc-burger--open":""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`wc-mobile-menu ${isMobileOpen?"wc-mobile-menu--open":""}`}>
        <div className="wc-mobile-inner">
          <a href="/" className="wc-mobile-link" onClick={toggleMobileMenu}>Home</a>
          <a href="/news" className="wc-mobile-link" onClick={toggleMobileMenu}>News</a>

          {NAV_SECTIONS.map((section)=>(
            <div key={section.key} className="wc-mobile-group">
              <div className="wc-mobile-group-title">{section.label}</div>

              <div className="wc-mobile-subtitle">Quick paths</div>
              {section.mega.quickLinks.map((item)=>(
                <a
                  key={item.href}
                  href={item.href}
                  className="wc-mobile-link wc-mobile-link--sub"
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </a>
              ))}

              <div className="wc-mobile-subtitle">Featured</div>
              {section.mega.featuredTools.map((item)=>(
                <a
                  key={item.href}
                  href={item.href}
                  className="wc-mobile-card"
                  onClick={toggleMobileMenu}
                >
                  <div className="wc-mobile-card-title">{item.label}</div>
                  <div className="wc-mobile-card-desc">{item.desc}</div>
                </a>
              ))}
            </div>
          ))}

          <a
            href="/get-help"
            className="wc-mobile-emergency"
            onClick={toggleMobileMenu}
          >
            Get Help Now • 24/7
          </a>
        </div>
      </div>
    </header>
  );
};

export default LuxuryNavbar;
