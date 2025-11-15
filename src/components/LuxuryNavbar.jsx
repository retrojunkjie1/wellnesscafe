// src/components/LuxuryNavbar.jsx
import React,{useEffect,useState} from "react";
import { useAuth } from "../AuthContext";
import "./LuxuryNavbar.css";

const NAV_SECTIONS=[
  {
    key:"recovery",
    label:"Recovery",
    items:[
      {label:"Recovery Hub",href:"/recovery"},
      {label:"Sobriety Dashboard",href:"/dashboard"},
      {label:"Trauma Education",href:"/trauma-education"},
      {label:"Trigger Tracker",href:"/tools/trigger-tracker"},
      {label:"Daily Check-In",href:"/check-in"},
    ]
  },
  {
    key:"tools",
    label:"Tools",
    items:[
      {label:"Tools Dashboard",href:"/tools"},
      {label:"Session Templates",href:"/sessions/templates"},
      {label:"Meditation Timer",href:"/tools/meditation"},
      {label:"Breathwork",href:"/tools/breathing"},
      {label:"Acuwellness",href:"/acuwellness"},
      {label:"Mood Check-In",href:"/tools/mood-checkin"},
      {label:"Affirmations",href:"/tools/affirmations"},
    ]
  },
  {
    key:"providers",
    label:"Providers",
    items:[
      {label:"Provider Directory",href:"/providers/directory"},
      {label:"Join as Provider",href:"/providers/apply"},
      {label:"About Providers",href:"/providers"},
      {label:"Sober Living Homes",href:"/assistance"},
      {label:"Provider Benefits",href:"/providers/benefits"},
    ]
  }
];

const LuxuryNavbar=()=>{
  const { currentUser, logout } = useAuth();
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

              {/* Compact dropdown menu */}
              <div className="wc-dropdown">
                <ul>
                  {section.items.map((item)=>(
                    <li key={item.href}>
                      <a href={item.href} className="wc-dropdown-link">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Right controls */}
        <div className="wc-navbar-right">
          <a href="/assistance" className="wc-cta-pill">
            <span>Get Help Now</span>
          </a>

          {/* Auth buttons */}
          {currentUser ? (
            <div className="wc-auth-group">
              <a href="/dashboard" className="wc-auth-link">Dashboard</a>
              <button onClick={logout} className="wc-auth-link wc-auth-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="wc-auth-group">
              <a href="/login" className="wc-auth-link">Login</a>
              <a href="/signup" className="wc-auth-link-primary">Sign Up</a>
            </div>
          )}

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
              {section.items.map((item)=>(
                <a
                  key={item.href}
                  href={item.href}
                  className="wc-mobile-link wc-mobile-link--sub"
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}

          <a
            href="/assistance"
            className="wc-mobile-emergency"
            onClick={toggleMobileMenu}
          >
            Get Help Now • 24/7
          </a>

          {/* Mobile auth section */}
          <div className="wc-mobile-auth">
            {currentUser ? (
              <>
                <a href="/dashboard" className="wc-mobile-link" onClick={toggleMobileMenu}>
                  Dashboard
                </a>
                <button onClick={()=>{logout();toggleMobileMenu();}} className="wc-mobile-link wc-mobile-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="wc-mobile-link" onClick={toggleMobileMenu}>
                  Login
                </a>
                <a href="/signup" className="wc-mobile-link-primary" onClick={toggleMobileMenu}>
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LuxuryNavbar;
