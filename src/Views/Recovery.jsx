import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertTriangle,
  Pill,
  MessageSquare,
  Users2,
  FlaskConical,
  Brain,
  HeartHandshake,
  Sparkles,
  PhoneCall,
  Search,
} from "lucide-react";
import { useAIWidget } from "../App";
import GetHelpNow from "../components/GetHelpNow";
import "./RecoveryPage.css";

const RecoveryPage = () => {
  const [activeTab, setActiveTab] = useState("understanding");
  const aiWidgetRef = useAIWidget();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGetHelp = (prompt) => {
    if (aiWidgetRef?.current) {
      aiWidgetRef.current.openWithPrompt(prompt);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "understanding":
        return <UnderstandingAddiction />;
      case "treatments":
        return <TreatmentOptions />;
      case "coping":
        return <ToolsAndCoping />;
      case "resources":
        return <SupportResources />;
      default:
        return <UnderstandingAddiction />;
    }
  };

  return (
    <div className="recovery-page">
      <Helmet>
        <title>Evidence-Based Addiction Recovery - Wellness Cafe</title>
        <meta
          name="description"
          content="A comprehensive, evidence-based guide to addiction recovery. Explore treatment options, coping strategies, and find support resources to start your journey."
        />
      </Helmet>

      {/* Hero Section */}
      <header className="recovery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-title">
            <h1 className="title-main">Your Path to Recovery Starts Here</h1>
            <p className="title-sub">
              An Evidence-Based Guide to Overcoming Addiction
            </p>
          </div>
          <p className="hero-description">
            Navigating the journey of recovery can be challenging, but you are
            not alone. This guide provides comprehensive, research-backed
            information on understanding addiction, exploring effective
            treatments, and finding the support you need.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">40-60%</span>
              <span className="stat-label">
                Success Rate with Evidence-Based Care
              </span>
            </div>
            <div className="stat">
              <span className="stat-number">20M+</span>
              <span className="stat-label">Americans in Recovery</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
          <div className="hero-actions">
            <GetHelpNow
              variant="hero"
              context="crisis"
              onOpenAI={handleGetHelp}
            />
            <button
              className="btn-secondary"
              onClick={() =>
                document
                  .getElementById("tabs")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Guide
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      <div className="emergency-banner">
        <AlertTriangle className="emergency-icon" aria-hidden="true" />
        <p>
          If you are in a crisis or life-threatening situation, call 911
          immediately.
        </p>
      </div>

      {/* Sticky Tabs */}
      <nav className="tabs-container" id="tabs">
        <button
          className={`tab ${activeTab === "understanding" ? "active" : ""}`}
          onClick={() => setActiveTab("understanding")}
        >
          Understanding Addiction
        </button>
        <button
          className={`tab ${activeTab === "treatments" ? "active" : ""}`}
          onClick={() => setActiveTab("treatments")}
        >
          Treatment Options
        </button>
        <button
          className={`tab ${activeTab === "coping" ? "active" : ""}`}
          onClick={() => setActiveTab("coping")}
        >
          Tools & Coping
        </button>
        <button
          className={`tab ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          Support Resources
        </button>
      </nav>

      {/* Tab Content */}
      <main>{renderContent()}</main>

      {/* CTA Section */}
      <section className="recovery-cta">
        <h2>Ready to Take the First Step?</h2>
        <p>
          Your journey to a healthier, substance-free life is unique. We're here
          to support you.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary-large">Find a Treatment Center</button>
          <button className="btn-secondary-large">Talk to a Counselor</button>
        </div>
        <p className="cta-note">
          All communications are 100% confidential and secure.
        </p>
      </section>
    </div>
  );
};

const UnderstandingAddiction = () => (
  <section className="content-section" id="understanding">
    <div className="section-header">
      <h2>Understanding Addiction: A Brain Disease</h2>
      <p>
        Addiction alters reward, stress, and self-control circuits in the brain.
        Recovery is possible with structured support, evidence-based care, and
        community.
      </p>
    </div>

    <div className="info-card-large">
      <h3>What Recovery Involves</h3>
      <p>
        Recovery is a process of change through which people improve their
        health and wellness, live a self-directed life, and strive to reach
        their full potential. Most people benefit from a combination of medical,
        psychological, social, and spiritual supports.
      </p>
      <p>
        Typical components include withdrawal stabilization, therapy and skills
        training, peer/community support, lifestyle rebuilding, and long-term
        relapse prevention.
      </p>
    </div>

    <div className="stages-section">
      <h3>Stages of Recovery</h3>
      <p className="stages-intro">
        Recovery is not linear. Many people cycle through stages and still
        progress over time.
      </p>
      <div className="stages-timeline">
        <div className="stage-card">
          <div className="stage-number">1</div>
          <h4>Stabilization & Safety</h4>
          <div className="stage-duration">Days to Weeks</div>
          <p className="stage-desc">
            Address withdrawal, cravings, sleep, nutrition, and acute risks with
            medical and social support.
          </p>
          <div className="stage-support">
            <strong>Helpful Now</strong>
            <p>
              Medical detox, MAT options, crisis lines, supportive routines,
              hydration, and rest.
            </p>
          </div>
        </div>
        <div className="stage-card">
          <div className="stage-number">2</div>
          <h4>Early Recovery Skills</h4>
          <div className="stage-duration">Weeks to Months</div>
          <p className="stage-desc">
            Learn coping skills, craving management, and trigger planning while
            rebuilding daily structure.
          </p>
          <div className="stage-support">
            <strong>Helpful Now</strong>
            <p>
              CBT or MI, peer groups, urge surfing, sleep hygiene, nutrition,
              exercise, and journaling.
            </p>
          </div>
        </div>
        <div className="stage-card">
          <div className="stage-number">3</div>
          <h4>Maintenance & Growth</h4>
          <div className="stage-duration">Months to Years</div>
          <p className="stage-desc">
            Strengthen skills, repair relationships, and pursue meaningful work,
            learning, and purpose.
          </p>
          <div className="stage-support">
            <strong>Helpful Now</strong>
            <p>
              Relapse prevention plan, mentorship, family therapy, mindfulness,
              and community roles.
            </p>
          </div>
        </div>
        <div className="stage-card">
          <div className="stage-number">4</div>
          <h4>Resilience & Relapse Prevention</h4>
          <div className="stage-duration">Ongoing</div>
          <p className="stage-desc">
            Anticipate high‑risk situations and build rapid‑response routines to
            stay on track after setbacks.
          </p>
          <div className="stage-support">
            <strong>Helpful Now</strong>
            <p>
              Booster sessions, check‑ins, and values‑aligned goals; compassion
              after slips.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="withdrawal-section">
      <h3>Common Withdrawal Timeline</h3>
      <p className="withdrawal-intro">
        Symptoms vary by substance, use pattern, and health. Seek medical advice
        before stopping abruptly.
      </p>
      <div className="timeline-grid">
        <div className="timeline-card">
          <div className="timeline-phase">0–72 Hours</div>
          <p>
            Acute symptoms like anxiety, insomnia, sweats, nausea. Hydration,
            nutrition, and monitoring help.
          </p>
        </div>
        <div className="timeline-card">
          <div className="timeline-phase">Days 3–7</div>
          <p>
            Symptoms may peak then ease. Cravings can surge as sleep debt
            resolves. Use skills and support.
          </p>
        </div>
        <div className="timeline-card">
          <div className="timeline-phase">Week 2–4</div>
          <p>
            Mood lability and energy swings are common. Routine, sunlight,
            movement, and therapy aid stability.
          </p>
        </div>
        <div className="timeline-card">
          <div className="timeline-phase">1–3 Months</div>
          <p>
            Sleep and focus improve. Continue skills practice, peer support, and
            relapse prevention planning.
          </p>
        </div>
      </div>
      <div className="medical-warning">
        <AlertTriangle className="warning-icon" aria-hidden="true" />
        <div>
          <strong>Medical Warning</strong>
          <p>
            Alcohol, benzodiazepine, and some opioid withdrawals can be
            dangerous. Consult a clinician about monitored detox or
            medication‑assisted treatment (MAT).
          </p>
        </div>
      </div>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-big">40–60%</div>
        <p>
          Average success rates with evidence‑based care and continuing support
        </p>
      </div>
      <div className="stat-card">
        <div className="stat-big">2x</div>
        <p>
          Higher engagement when combining therapy with peer/community support
        </p>
      </div>
      <div className="stat-card">
        <div className="stat-big">24/7</div>
        <p>
          Hotlines and crisis resources are available any time you need help
        </p>
      </div>
    </div>
  </section>
);

const TreatmentOptions = () => (
  <section className="content-section" id="treatments">
    <div className="section-header">
      <h2>Evidence-Based Treatment Options</h2>
      <p>
        Combine medical care, therapy, skills practice, and peer/community
        supports for best outcomes.
      </p>
    </div>

    <div className="treatments-grid">
      <div className="treatment-card">
        <div className="treatment-header">
          <Pill className="treatment-icon" aria-hidden="true" />
          <div>
            <h3>Medication‑Assisted Treatment (MAT)</h3>
            <span className="effectiveness-badge">High Effectiveness</span>
          </div>
        </div>
        <p className="treatment-desc">
          Reduces cravings and withdrawal. Common for opioid and alcohol use
          disorders.
        </p>
        <div className="treatment-section">
          <h4>Includes</h4>
          <ul>
            <li>Buprenorphine, methadone, or naltrexone (as appropriate)</li>
            <li>Alcohol: naltrexone, acamprosate, disulfiram (select cases)</li>
          </ul>
        </div>
        <div className="research-note">
          <FlaskConical />
          <p>
            MAT plus counseling improves retention and reduces mortality versus
            counseling alone.
          </p>
        </div>
        <button className="learn-more-btn">Discuss MAT options</button>
      </div>

      <div className="treatment-card">
        <div className="treatment-header">
          <MessageSquare className="treatment-icon" aria-hidden="true" />
          <div>
            <h3>Cognitive Behavioral Therapy (CBT)</h3>
            <span className="effectiveness-badge">Strong Evidence</span>
          </div>
        </div>
        <p className="treatment-desc">
          Builds coping skills, restructures thoughts, and strengthens relapse
          prevention.
        </p>
        <div className="treatment-section">
          <h4>Skills</h4>
          <ul>
            <li>Trigger mapping and coping plans</li>
            <li>Urge surfing and cravings scheduling</li>
            <li>Values‑aligned goal setting</li>
          </ul>
        </div>
        <div className="research-note">
          <FlaskConical />
          <p>
            CBT shows durable benefits when combined with peer support or MAT
            where indicated.
          </p>
        </div>
        <button className="learn-more-btn">Find a CBT therapist</button>
      </div>

      <div className="treatment-card">
        <div className="treatment-header">
          <HeartHandshake className="treatment-icon" aria-hidden="true" />
          <div>
            <h3>Motivational Interviewing (MI)</h3>
            <span className="effectiveness-badge">Strong Evidence</span>
          </div>
        </div>
        <p className="treatment-desc">
          Helps resolve ambivalence and strengthen intrinsic motivation for
          change.
        </p>
        <div className="treatment-section">
          <h4>Helpful For</h4>
          <ul>
            <li>Early stages of change</li>
            <li>Re‑engagement after a lapse</li>
          </ul>
        </div>
        <div className="research-note">
          <FlaskConical />
          <p>
            Often used as an on‑ramp to CBT, group therapy, or MAT; improves
            engagement and retention.
          </p>
        </div>
        <button className="learn-more-btn">Talk with a counselor</button>
      </div>

      <div className="treatment-card">
        <div className="treatment-header">
          <Users2 className="treatment-icon" aria-hidden="true" />
          <div>
            <h3>Peer & Group Support</h3>
            <span className="effectiveness-badge">Accessible</span>
          </div>
        </div>
        <p className="treatment-desc">
          Options include 12‑Step, SMART Recovery, Refuge Recovery, and other
          groups.
        </p>
        <div className="treatment-section">
          <h4>Benefits</h4>
          <ul>
            <li>Community, structure, accountability</li>
            <li>Mentorship and lived‑experience guidance</li>
          </ul>
        </div>
        <div className="research-note">
          <FlaskConical />
          <p>
            Participation correlates with higher abstinence rates and
            connectedness, especially alongside therapy.
          </p>
        </div>
        <button className="learn-more-btn">Find a meeting</button>
      </div>
    </div>

    <div className="combination-section">
      <h3>Effective Combinations</h3>
      <p>
        Blending treatments often improves engagement and long‑term outcomes.
      </p>
      <div className="combo-examples">
        <div className="combo-card">
          <h4>MAT + CBT</h4>
          <p>
            Stabilize physiology while building coping and relapse‑prevention
            skills.
          </p>
          <span className="combo-result">Improved Retention</span>
        </div>
        <div className="combo-card">
          <h4>MI + Group</h4>
          <p>
            Increase readiness, then sustain change with community structure and
            mentorship.
          </p>
          <span className="combo-result">Higher Engagement</span>
        </div>
        <div className="combo-card">
          <h4>Therapy + Family Work</h4>
          <p>
            Reduce conflict, set healthy boundaries, and rebuild trust and
            routines at home.
          </p>
          <span className="combo-result">Stronger Support</span>
        </div>
      </div>
    </div>
  </section>
);

const ToolsAndCoping = () => (
  <section className="content-section" id="coping">
    <div className="section-header">
      <h2>Tools & Coping Strategies</h2>
      <p>
        Practice small, repeatable habits that reduce cravings and support a
        stable routine.
      </p>
    </div>

    <div className="tools-grid">
      <div className="tool-card">
        <h3>
          <Brain aria-hidden="true" /> Focused Breathing
        </h3>
        <p>
          Use 4‑7‑8 or box breathing to calm the nervous system in 60–90
          seconds.
        </p>
        <div className="tool-features">
          <h4>How To</h4>
          <ul>
            <li>Inhale 4s, hold 7s, exhale 8s × 4 rounds</li>
            <li>Pair with a grounding cue like “I can ride this out.”</li>
          </ul>
        </div>
        <button className="try-tool-btn">Try breathing timer</button>
      </div>

      <div className="tool-card">
        <h3>
          <Sparkles aria-hidden="true" /> Urge Surfing
        </h3>
        <p>
          Notice cravings as waves that rise and fall. Most peak within 10–20
          minutes.
        </p>
        <div className="tool-features">
          <h4>Steps</h4>
          <ul>
            <li>Label: “This is a craving”</li>
            <li>Locate sensations in the body</li>
            <li>Breathe, ride the wave, re‑focus on values</li>
          </ul>
        </div>
        <button className="try-tool-btn">Start a 10‑minute timer</button>
      </div>

      <div className="tool-card">
        <h3>
          <MessageSquare aria-hidden="true" /> Trigger Plan
        </h3>
        <p>
          Create if‑then plans for common triggers to reduce decision fatigue.
        </p>
        <div className="tool-features">
          <h4>Examples</h4>
          <ul>
            <li>If stressed after work → 10‑min walk + call a peer</li>
            <li>
              If lonely on weekends → schedule a meeting + coffee with a friend
            </li>
          </ul>
        </div>
        <button className="try-tool-btn">Generate trigger plan</button>
      </div>
    </div>

    <div className="coping-skills">
      <h3>Coping Skills Library</h3>
      <div className="skills-grid">
        {[
          {
            icon: "🧭",
            title: "Values Check‑In",
            text: "Reconnect to why recovery matters to you.",
          },
          {
            icon: "📝",
            title: "Mood Journal",
            text: "Track patterns that precede cravings.",
          },
          {
            icon: "🚶",
            title: "Movement Snack",
            text: "2–5 minutes of walking or stretching.",
          },
          {
            icon: "📵",
            title: "Delay & Distract",
            text: "Delay urges 10 minutes; swap an alternative.",
          },
          {
            icon: "🛌",
            title: "Sleep Reset",
            text: "Wind‑down routine; consistent wake time.",
          },
        ].map((s) => (
          <div className="skill-card" key={s.title}>
            <span className="skill-icon" aria-hidden="true">
              {s.icon}
            </span>
            <h4>{s.title}</h4>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SupportResources = () => (
  <section className="content-section" id="resources">
    <div className="section-header">
      <h2>Find Support and Resources</h2>
      <p>
        You are not alone. Connect with communities and services dedicated to
        helping you succeed.
      </p>
    </div>

    <div className="emergency-resources" id="emergency-resources">
      <h3>Emergency & Crisis Hotlines</h3>
      <div className="hotlines-grid">
        <div className="hotline-card">
          <h4>
            <PhoneCall aria-hidden="true" /> 988 Suicide & Crisis Lifeline
          </h4>
          <a className="hotline-number" href="tel:988">
            Call 988
          </a>
          <div className="hotline-text">24/7 nationwide, confidential</div>
          <div className="hotline-desc">
            Talk to a trained counselor right now.
          </div>
        </div>
        <div className="hotline-card">
          <h4>
            <PhoneCall aria-hidden="true" /> SAMHSA National Helpline
          </h4>
          <a className="hotline-number" href="tel:1800662HELP">
            1‑800‑662‑HELP
          </a>
          <div className="hotline-text">
            Substance use & mental health referrals
          </div>
          <div className="hotline-desc">
            Treatment locators, advice, and support.
          </div>
        </div>
        <div className="hotline-card">
          <h4>
            <PhoneCall aria-hidden="true" /> Veterans Crisis Line
          </h4>
          <a className="hotline-number" href="tel:988">
            Call 988 then press 1
          </a>
          <div className="hotline-text">
            Text: 838255 • Chat: veteranscrisisline.net
          </div>
          <div className="hotline-desc">
            Support for Veterans and their loved ones.
          </div>
        </div>
      </div>
    </div>

    <div className="meeting-finder">
      <h3>Meetings & Support Groups</h3>
      <div className="meeting-options">
        <div className="meeting-card">
          <h4>12‑Step & Alternatives</h4>
          <ul>
            <li>
              <a
                href="https://www.aa.org/find-aa"
                target="_blank"
                rel="noreferrer"
              >
                Alcoholics Anonymous (AA)
              </a>
            </li>
            <li>
              <a
                href="https://www.na.org/meetingsearch/"
                target="_blank"
                rel="noreferrer"
              >
                Narcotics Anonymous (NA)
              </a>
            </li>
            <li>
              <a
                href="https://www.smartrecovery.org/"
                target="_blank"
                rel="noreferrer"
              >
                SMART Recovery
              </a>
            </li>
            <li>
              <a
                href="https://refugerecovery.org/"
                target="_blank"
                rel="noreferrer"
              >
                Refuge Recovery
              </a>
            </li>
          </ul>
        </div>
        <div className="meeting-card">
          <h4>Family & Loved Ones</h4>
          <ul>
            <li>
              <a href="https://al-anon.org/" target="_blank" rel="noreferrer">
                Al‑Anon / Alateen
              </a>
            </li>
            <li>
              <a href="https://naranon.org/" target="_blank" rel="noreferrer">
                Nar‑Anon Family Groups
              </a>
            </li>
            <li>
              <a
                href="https://adultchildren.org/"
                target="_blank"
                rel="noreferrer"
              >
                ACA (Adult Children of Alcoholics)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="treatment-finder">
      <h3>Treatment Finder</h3>
      <div className="finder-card">
        <p>Search treatment programs near you using your ZIP code.</p>
        <input
          className="zip-input"
          placeholder="Enter ZIP code"
          inputMode="numeric"
          maxLength={10}
        />
        <button className="search-btn">
          <Search aria-hidden="true" /> Search
        </button>
        <p className="finder-note">
          Tip: You can also call the SAMHSA Helpline above to speak with a
          navigator.
        </p>
      </div>
    </div>
  </section>
);

export default RecoveryPage;
