import{j as e,L as t}from"./react-vendor-C2vFB_vl.js";import{a as o}from"./index-DXzZvwKr.js";import"./dashboard-CVcobGzz.js";import"./ai-engine-JLcQPJPS.js";import"./core-libs-c5XOvvj3.js";import"./ui-heavy-C7pdA4pD.js";const g=()=>{const{toggleTheme:a,isDark:s}=o(),n=[{step:1,title:"Quick Approval Process",shortDesc:"Most applications reviewed within 24-48 hours",fullDesc:`Our streamlined application process ensures you can start helping clients as quickly as possible. Here's what happens after you submit your application:

• Initial automated review of required fields and basic qualifications
• Manual review by our provider relations team within 24-48 hours
• Credential verification for licenses and certifications
• Background check processing (if required for your specialty)
• Final approval and account activation

We prioritize applications from qualified practitioners and typically respond within one business day.`,timeline:"24-48 hours",requirements:["Complete application form","Valid professional credentials","Active professional liability insurance","Clear background check (if applicable)"]},{step:2,title:"Profile Setup & Optimization",shortDesc:"Create a compelling profile showcasing your specialties",fullDesc:`Your profile is your digital storefront - make it count! Our profile setup process helps you create an engaging presence that attracts the right clients:

• Professional photo and bio writing assistance
• Specialty and service selection with detailed descriptions
• Rate setting guidance based on market standards
• Calendar integration for seamless scheduling
• Portfolio section for additional credentials and achievements

We provide templates and best practices to help you create a profile that converts browsers into clients.`,timeline:"1-2 days",requirements:["Professional headshot","Detailed bio (200-500 words)","Service offerings and specialties","Rate structure","Calendar availability"]},{step:3,title:"Client Matching & Onboarding",shortDesc:"Smart algorithm matches you with ideal clients",fullDesc:`Our intelligent matching system connects you with clients who need your specific expertise and align with your availability:

• Algorithm considers client needs, your specialties, and scheduling preferences
• Geographic matching for in-person sessions
• Modality-specific matching (yoga, therapy, acupuncture, etc.)
• Client intake forms to ensure compatibility
• Trial session option for new client relationships

Once matched, you'll receive client information and can begin booking sessions immediately.`,timeline:"Immediate",requirements:["Active profile approval","Calendar availability set","Client intake process completion","Session preparation"]},{step:4,title:"Ongoing Support & Growth",shortDesc:"Access resources, community, and continuous education",fullDesc:`Your success is our success. We provide comprehensive support to help you build and maintain a thriving practice:

• Dedicated provider success manager for personalized guidance
• Marketing resources and client acquisition strategies
• Continuing education credits and professional development
• Community forums for peer support and networking
• Analytics dashboard for practice insights and optimization

Regular check-ins and quarterly business reviews help you maximize your potential on our platform.`,timeline:"Ongoing",requirements:["Monthly provider check-ins","Quarterly business reviews","Continuing education participation","Community engagement","Practice analytics review"]}];return e.jsxs("section",{className:"pv-wrap",children:[e.jsxs("div",{className:"pv-header",children:[e.jsxs("div",{children:[e.jsx(t,{to:"/providers/apply",className:"back-link",children:"← Back to Application"}),e.jsx("h1",{className:"pv-title",children:"What to Expect"}),e.jsx("p",{className:"pv-sub",children:"Your complete guide to joining and succeeding on WellnessCafe"})]}),e.jsx("button",{className:"theme-toggle",onClick:a,"aria-label":`Switch to ${s?"light":"dark"} theme`,children:s?"☀️":"🌙"})]}),e.jsx("div",{className:"expectations-timeline",children:n.map((i,l)=>e.jsxs("div",{className:"expectation-detail-card",children:[e.jsxs("div",{className:"expectation-step-header",children:[e.jsx("div",{className:"pv-expectation-step",children:i.step}),e.jsx("div",{className:"step-timeline",children:i.timeline})]}),e.jsxs("div",{className:"expectation-content",children:[e.jsx("h2",{children:i.title}),e.jsx("p",{className:"expectation-short-desc",children:i.shortDesc}),e.jsxs("div",{className:"expectation-full-content",children:[e.jsx("p",{className:"expectation-full-desc",children:i.fullDesc}),e.jsxs("div",{className:"expectation-requirements",children:[e.jsx("h3",{children:"Requirements & Next Steps:"}),e.jsx("ul",{children:i.requirements.map((r,c)=>e.jsx("li",{children:r},`step-${i.step}-req-${c}`))})]})]})]})]},i.step))}),e.jsxs("div",{className:"process-summary",children:[e.jsx("h2",{children:"Ready to Begin Your Journey?"}),e.jsxs("div",{className:"process-stats",children:[e.jsxs("div",{className:"stat-item",children:[e.jsx("div",{className:"stat-number",children:"24-48hrs"}),e.jsx("div",{className:"stat-label",children:"Average Approval Time"})]}),e.jsxs("div",{className:"stat-item",children:[e.jsx("div",{className:"stat-number",children:"95%"}),e.jsx("div",{className:"stat-label",children:"Application Success Rate"})]}),e.jsxs("div",{className:"stat-item",children:[e.jsx("div",{className:"stat-number",children:"7 days"}),e.jsx("div",{className:"stat-label",children:"Average First Client Match"})]})]}),e.jsx(t,{to:"/providers/apply",className:"cta-button",children:"Start Your Application"})]})]})};export{g as default};
