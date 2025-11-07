import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AssistancePage.css';

const AssistPage = () => {
  const [householdSize, setHouseholdSize] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [state, setState] = useState('');
  const [hasDisability, setHasDisability] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [eligiblePrograms, setEligiblePrograms] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const programs = [
    {
      icon: '🍽️',
      badge: 'Food Security',
      title: 'SNAP (Food Stamps)',
      description: 'The Supplemental Nutrition Assistance Program helps families purchase healthy food. In 2024, over 42 million Americans receive SNAP benefits averaging $193 per person monthly.',
      details: {
        eligibility: [
          'Gross income at or below 130% of poverty line',
          'Net income at or below 100% of poverty line',
          'U.S. citizen or qualified non-citizen',
          'Work requirements for able-bodied adults'
        ]
      }
    },
    {
      icon: '🏥',
      badge: 'Healthcare',
      title: 'Medicaid',
      description: 'Medicaid provides free or low-cost health coverage to eligible adults, children, pregnant women, elderly adults, and people with disabilities. Coverage includes doctor visits, hospital stays, preventive care, mental health services, and substance abuse treatment.',
      details: {
        eligibility: [
          'Income at or below 138% of federal poverty level (expansion states)',
          'Pregnant women and children may qualify at higher income levels',
          'Elderly and disabled individuals have different thresholds',
          'Coverage varies by state'
        ]
      }
    },
    {
      icon: '🏠',
      badge: 'Housing',
      title: 'Housing Assistance',
      description: 'HUD programs including Section 8 Housing Choice Vouchers, Public Housing, and emergency rental assistance help low-income families afford safe, decent housing. Wait times vary by location but assistance can cover 70% or more of rent costs.',
      details: {
        eligibility: [
          'Income at or below 50% of area median income',
          'U.S. citizenship or eligible immigration status',
          'Pass background check (some exceptions)',
          'Local housing authority application required'
        ]
      }
    },
    {
      icon: '💡',
      badge: 'Utilities',
      title: 'LIHEAP (Utility Assistance)',
      description: 'Low Income Home Energy Assistance Program helps with heating and cooling bills, energy crisis situations, and weatherization. Average assistance is $500-800 annually, with priority for households with elderly, disabled, or young children.',
      details: {
        eligibility: [
          'Income at or below 150% of poverty level (varies by state)',
          'Priority for households with vulnerable members',
          'Must be responsible for home heating/cooling costs',
          'Crisis assistance available year-round in many states'
        ]
      }
    },
    {
      icon: '👶',
      badge: 'Childcare',
      title: 'Childcare Subsidies',
      description: 'The Child Care and Development Fund (CCDF) helps working families afford childcare through vouchers, reduced copayments, or direct services. Subsidies can cover 70-90% of childcare costs for eligible families.',
      details: {
        eligibility: [
          'Working, attending school, or in job training',
          'Income varies by state (typically 85% of state median)',
          'Children under 13 (or special needs up to 19)',
          'Immunization and health screening requirements'
        ]
      }
    },
    {
      icon: '🎖️',
      badge: 'Veterans',
      title: 'VA Benefits',
      description: 'Veterans Affairs provides healthcare, disability compensation, education benefits (GI Bill), home loans, and vocational rehabilitation. Over 9 million veterans receive VA benefits with comprehensive support for service-connected conditions.',
      details: {
        eligibility: [
          'Honorable discharge from military service',
          'Minimum service requirements vary by benefit',
          'Service-connected disabilities receive priority',
          'Income limits for some healthcare benefits'
        ]
      }
    }
  ];

  const applicationSteps = [
    {
      step: '1',
      title: 'Determine Eligibility',
      description: 'Use our calculator above or visit Benefits.gov to pre-screen for multiple programs. Gather household information including income, assets, and family composition.',
      tips: ['Check income limits for your household size', 'Identify all household members', 'Calculate total monthly income from all sources']
    },
    {
      step: '2',
      title: 'Gather Documentation',
      description: 'Collect required documents before applying. Most programs need proof of identity, income, residency, and citizenship. Having everything ready speeds up the process significantly.',
      tips: ['Photo ID or birth certificate', 'Social Security cards', 'Recent pay stubs or tax returns', 'Utility bills showing address', 'Bank statements']
    },
    {
      step: '3',
      title: 'Submit Application',
      description: 'Apply online, by mail, or in person at your local office. Online applications are fastest and allow you to track status. Many states have combined applications for multiple programs.',
      tips: ['Apply at Benefits.gov for federal programs', 'Visit your state\'s assistance website', 'Call local offices for help with application', 'Keep copies of everything you submit']
    },
    {
      step: '4',
      title: 'Complete Interview',
      description: 'Many programs require an interview (phone or in-person). Be honest about your situation, answer questions clearly, and bring requested documents. This is your chance to explain special circumstances.',
      tips: ['Schedule interview within required timeframe', 'Prepare to discuss household finances', 'Ask questions if anything is unclear', 'Follow up if you don\'t hear back']
    },
    {
      step: '5',
      title: 'Receive Decision & Benefits',
      description: 'Decision timelines vary: SNAP (30 days), Medicaid (45-90 days), Housing (varies). If approved, you\'ll receive benefit card, enrollment information, or payment schedule. If denied, you have the right to appeal.',
      tips: ['Watch for notices in mail', 'Activate benefit cards immediately', 'Report changes in income or household', 'Complete recertification on time']
    }
  ];

  const faqs = [
    {
      question: 'How do I know which programs I qualify for?',
      answer: 'Use the eligibility calculator above for a quick assessment. Each program has different income and eligibility requirements. Generally, if your household income is below 200% of the federal poverty level, you likely qualify for at least one program. Visit Benefits.gov for comprehensive screening, or contact your local Department of Social Services for personalized guidance.'
    },
    {
      question: 'How long does the application process take?',
      answer: 'Processing times vary by program: SNAP typically takes 30 days (7 days for emergency), Medicaid can take 45-90 days, Housing assistance often has waiting lists from 6 months to several years. To speed things up, submit complete applications with all required documents, respond quickly to requests for information, and follow up if you haven\'t heard back within the standard timeframe.'
    },
    {
      question: 'Can I receive multiple benefits at the same time?',
      answer: 'Yes! Most assistance programs are designed to work together. You can receive SNAP, Medicaid, housing assistance, and utility help simultaneously. In fact, qualifying for one program often makes you automatically eligible for others (called "categorical eligibility"). Some programs even have combined applications to make it easier.'
    },
    {
      question: 'What if I\'m denied? Can I appeal?',
      answer: 'Absolutely. You have the right to appeal any denial decision. Most programs give you 30-90 days to file an appeal. Request a copy of the decision notice explaining why you were denied. Common reasons include incomplete applications, income calculations, or missing documentation. During appeal, you can submit additional information and have a hearing. Legal aid organizations can help with appeals for free.'
    },
    {
      question: 'Will receiving benefits affect my immigration status?',
      answer: 'This depends on your immigration status and the benefit. Many benefits do NOT count under public charge rules, including: Medicaid (with exceptions), CHIP, SNAP, housing assistance (in most cases), and emergency services. Refugees, asylees, and certain other immigrants are eligible for most programs. If concerned, consult with an immigration attorney or accredited representative before applying.'
    },
    {
      question: 'Do I need to repay assistance benefits?',
      answer: 'No, most assistance programs are grants, not loans. SNAP, Medicaid, housing vouchers, and utility assistance do not need to be repaid. However, if you receive benefits you weren\'t eligible for due to fraud or failure to report changes, you may have to repay. Some programs like TANF have work requirements. Always report income changes promptly to avoid overpayments.'
    }
  ];

  const stateResources = {
    'California': {
      programs: [
        { name: 'CalFresh (SNAP)', phone: '1-877-847-3663', website: 'getcalfresh.org' },
        { name: 'Medi-Cal', phone: '1-800-541-5555', website: 'dhcs.ca.gov' },
        { name: 'CalWORKs', phone: '1-877-847-3663', website: 'cdss.ca.gov' }
      ]
    },
    'Texas': {
      programs: [
        { name: 'SNAP (Lone Star Card)', phone: '1-877-541-7905', website: 'yourtexasbenefits.com' },
        { name: 'Texas Medicaid', phone: '1-800-252-8263', website: 'hhs.texas.gov' },
        { name: 'TANF', phone: '1-877-541-7905', website: 'hhs.texas.gov' }
      ]
    },
    'New York': {
      programs: [
        { name: 'SNAP', phone: '1-800-342-3009', website: 'otda.ny.gov' },
        { name: 'NY Medicaid', phone: '1-855-355-5777', website: 'health.ny.gov' },
        { name: 'Emergency Assistance', phone: '1-800-342-3009', website: 'otda.ny.gov' }
      ]
    },
    'Florida': {
      programs: [
        { name: 'SNAP (EBT)', phone: '1-866-762-2237', website: 'myflfamilies.com' },
        { name: 'Florida Medicaid', phone: '1-888-419-3456', website: 'flmedicaidtplrecovery.com' },
        { name: 'Temporary Cash Assistance', phone: '1-866-762-2237', website: 'myflfamilies.com' }
      ]
    }
  };

  const handleEligibilityCheck = (e) => {
    e.preventDefault();
    
    // Simple eligibility logic (2024 Federal Poverty Guidelines)
    const fplLimits = {
      1: 1215, 2: 1644, 3: 2072, 4: 2500, 5: 2929, 6: 3357, 7: 3785, 8: 4214
    };
    
    const fplLimit = fplLimits[householdSize] || 4214;
    const incomeRatio = monthlyIncome / fplLimit;
    
    const eligible = [];
    
    if (incomeRatio <= 1.3) eligible.push('SNAP (Food Assistance)');
    if (incomeRatio <= 1.38) eligible.push('Medicaid');
    if (incomeRatio <= 0.5) eligible.push('Housing Choice Voucher (Section 8)');
    if (incomeRatio <= 1.5) eligible.push('LIHEAP (Utility Assistance)');
    if (hasChildren && incomeRatio <= 0.85) eligible.push('Childcare Subsidies');
    if (incomeRatio <= 1.85) eligible.push('WIC (if pregnant or young children)');
    
    setEligiblePrograms(eligible);
    setShowResults(true);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="assistance-page">
      {/* Hero Section */}
      <section className="assistance-hero">
        <div className="assistance-hero-content">
          <h1>Navigate Government Assistance Programs</h1>
          <p className="assistance-hero-subtitle">
            Comprehensive guidance to federal and state benefits. Over 85,000 families helped. 
            Access food security, healthcare, housing, and financial support resources.
          </p>
          <div className="assistance-stats">
            <div className="stat-item">
              <span className="stat-number">85K+</span>
              <span className="stat-label">Families Helped</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">$2.4M</span>
              <span className="stat-label">Benefits Secured</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">92%</span>
              <span className="stat-label">Approval Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="assistance-intro">
        <h2>Why Government Assistance Matters</h2>
        <p>
          Government assistance programs are not handouts—they're investments in community wellbeing and recovery. 
          These programs exist because we recognize that everyone faces challenges, and access to basic needs like 
          food, healthcare, and shelter creates the foundation for stability and growth.
        </p>
        <p>
          Whether you're in recovery, facing a temporary setback, or managing a long-term situation, these 
          resources can provide critical support. There's no shame in accessing programs you're entitled to—
          they're designed to help people like you build better futures.
        </p>
      </section>

      {/* Programs Grid */}
      <section className="programs-grid">
        {programs.map((program, index) => (
          <div key={index} className="program-card">
            <span className="program-icon">{program.icon}</span>
            <span className="program-badge">{program.badge}</span>
            <h3>{program.title}</h3>
            <p className="program-description">{program.description}</p>
            <div className="program-details">
              <h4>Basic Eligibility:</h4>
              <ul>
                {program.details.eligibility.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Eligibility Checker */}
      <section className="eligibility-section">
        <div className="eligibility-content">
          <h2>Check Your Eligibility</h2>
          <p>
            Answer a few simple questions to see which programs you may qualify for. 
            This is an estimate only—official eligibility is determined by your local office.
          </p>
          
          <form className="eligibility-calculator" onSubmit={handleEligibilityCheck}>
            <div className="calculator-inputs">
              <div className="input-group">
                <label>Household Size</label>
                <select value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} required>
                  <option value="">Select...</option>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                </select>
              </div>
              
              <div className="input-group">
                <label>Monthly Household Income (before taxes)</label>
                <input 
                  type="number" 
                  value={monthlyIncome} 
                  onChange={(e) => setMonthlyIncome(e.target.value)} 
                  placeholder="$2,000"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>State</label>
                <select value={state} onChange={(e) => setState(e.target.value)} required>
                  <option value="">Select your state...</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                  <option value="New York">New York</option>
                  <option value="Other">Other State</option>
                </select>
              </div>
              
              <div className="input-group" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={hasChildren} 
                    onChange={(e) => setHasChildren(e.target.checked)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  Have children under 18
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={hasDisability} 
                    onChange={(e) => setHasDisability(e.target.checked)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  Have disability
                </label>
              </div>
            </div>
            
            <button type="submit" className="check-btn">Check Eligibility</button>
            
            {showResults && (
              <div className="eligibility-results">
                <h3 className="results-title">
                  {eligiblePrograms.length > 0 ? 'You may qualify for:' : 'Limited matches found'}
                </h3>
                {eligiblePrograms.length > 0 ? (
                  <ul className="eligible-programs">
                    {eligiblePrograms.map((program, idx) => (
                      <li key={idx}>{program}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>
                    Based on your income, you may have limited eligibility. However, special circumstances 
                    (disability, medical expenses, etc.) can affect eligibility. Contact your local office 
                    for a complete assessment.
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Application Process Timeline */}
      <section className="process-timeline">
        <h2>How to Apply: Step-by-Step</h2>
        <div className="timeline-steps">
          {applicationSteps.map((step, index) => (
            <div key={index} className="timeline-step" data-step={step.step}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <ul>
                {step.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* State Resources */}
      <section className="state-resources">
        <div className="state-resources-content">
          <h2>State-Specific Resources</h2>
          <p className="state-resources-intro">
            Select your state to find local contact information and resources.
          </p>
          
          <div className="state-selector">
            <label>Choose Your State:</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="">Select state...</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
              <option value="New York">New York</option>
              <option value="Florida">Florida</option>
            </select>
          </div>
          
          {selectedState && stateResources[selectedState] && (
            <div className="state-info">
              <h3>{selectedState} Assistance Programs</h3>
              <div className="resource-grid">
                {stateResources[selectedState].programs.map((prog, idx) => (
                  <div key={idx} className="resource-item">
                    <h4>{prog.name}</h4>
                    <p><strong>Phone:</strong> {prog.phone}</p>
                    <p><strong>Website:</strong> <a href={`https://${prog.website}`} target="_blank" rel="noopener noreferrer">{prog.website}</a></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crisis Hotlines */}
      <section className="crisis-section">
        <h2>Need Immediate Help?</h2>
        <div className="hotlines-grid">
          <div className="hotline-card">
            <h3>988 Suicide & Crisis</h3>
            <span className="hotline-number">988</span>
            <p className="hotline-description">24/7 suicide prevention and mental health crisis support</p>
          </div>
          <div className="hotline-card">
            <h3>SAMHSA Helpline</h3>
            <span className="hotline-number">1-800-662-4357</span>
            <p className="hotline-description">Substance abuse and mental health referrals</p>
          </div>
          <div className="hotline-card">
            <h3>Benefits.gov</h3>
            <span className="hotline-number">1-800-333-4636</span>
            <p className="hotline-description">General information about federal benefit programs</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="assistance-cta">
        <div className="assistance-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Don't wait—assistance is available now. Our team can help you complete applications, 
            gather documents, and navigate the system. All services are free and confidential.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn-primary">Get Free Help</Link>
            <Link to="/contact" className="cta-btn-secondary">Ask a Question</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssistPage;
