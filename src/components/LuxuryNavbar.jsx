// src/components/LuxuryNavbar.jsx
import React,{useEffect,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const handleLinkClick=(e,href)=>{
    e.preventDefault();
    setIsMobileOpen(false);
    setActiveMega(null);
    navigate(href);
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
          <Link to="/" className="wc-brand">
            <span className="wc-brand-mark">WELLNESSCAFE</span>
            <span className="wc-brand-ripple">≋</span>
          </Link>
        </div>

        {/* Desktop center nav */}
        <nav className="wc-navbar-center">
          <Link to="/" className="wc-nav-link">Home</Link>
          <Link to="/news" className="wc-nav-link">News</Link>

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
                      <Link 
                        to={item.href} 
                        className="wc-dropdown-link"
                        onClick={()=>setActiveMega(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Right controls */}
        <div className="wc-navbar-right">
          <Link to="/assistance" className="wc-cta-pill">
            <span>Get Help Now</span>
          </Link>

          {/* Auth buttons */}
          {currentUser ? (
            <div className="wc-auth-group">
              <Link to="/dashboard" className="wc-auth-link">Dashboard</Link>
              <button onClick={logout} className="wc-auth-link wc-auth-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="wc-auth-group">
              <Link to="/login" className="wc-auth-link">Login</Link>
              <Link to="/signup" className="wc-auth-link-primary">Sign Up</Link>
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
          <Link to="/" className="wc-mobile-link" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/news" className="wc-mobile-link" onClick={toggleMobileMenu}>News</Link>

          {NAV_SECTIONS.map((section)=>(
            <div key={section.key} className="wc-mobile-group">
              <div className="wc-mobile-group-title">{section.label}</div>
              {section.items.map((item)=>(
                <Link
                  key={item.href}
                  to={item.href}
                  className="wc-mobile-link wc-mobile-link--sub"
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          <Link
            to="/assistance"
            className="wc-mobile-emergency"
            onClick={toggleMobileMenu}
          >
            Get Help Now • 24/7
          </Link>

          {/* Mobile auth section */}
          <div className="wc-mobile-auth">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="wc-mobile-link" onClick={toggleMobileMenu}>
                  Dashboard
                </Link>
                <button onClick={()=>{logout();toggleMobileMenu();}} className="wc-mobile-link wc-mobile-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="wc-mobile-link" onClick={toggleMobileMenu}>
                  Login
                </Link>
                <Link to="/signup" className="wc-mobile-link-primary" onClick={toggleMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LuxuryNavbar;
