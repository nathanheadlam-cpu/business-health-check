import { useState, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SECTIONS = [
{
id: "direction",
title: "Direction & Strategy",
code: "01",
description: "Vision, goals, strategic planning and prioritisation",
questions: [
"I have a clear vision for where this business needs to be in the next 12 months.",
"The business has defined goals with measurable targets attached to them.",
"I have a written strategy or plan that guides key decisions.",
"I regularly review business performance against our stated goals.",
"My time and resources are allocated in line with our highest priorities.",
"I understand the key threats and opportunities in our market.",
"We make decisions based on commercial logic rather than habit or instinct alone.",
"The long-term direction of the business is clear to me and communicated to my team.",
"I actively review and adjust the business strategy as conditions change.",
],
},
{
id: "financial",
title: "Financial Performance",
code: "02",
description: "Revenue, profitability, cash flow, pricing and reporting",
questions: [
"I understand the key financial drivers of my business.",
"The business generates consistent and predictable revenue.",
"I have clear visibility of cash flow at least 4–8 weeks ahead.",
"Our pricing reflects the true value we deliver and is reviewed regularly.",
"I know our gross and net profit margins and monitor them monthly.",
"We have reliable financial reporting that informs business decisions.",
"The business is not over-reliant on a single client, product or revenue stream.",
"I have a clear understanding of our break-even position.",
"Financial performance is improving year on year.",
"I can identify quickly where the business is making and losing money.",
],
},
{
id: "customers",
title: "Customers & Marketing",
code: "03",
description: "Acquisition, retention, lead generation and brand positioning",
questions: [
"I have a consistent and reliable source of new customers or clients.",
"We have a clearly defined ideal customer profile and target market.",
"Our marketing activity generates measurable leads and enquiries.",
"The business has a strong reputation and clear brand positioning in our market.",
"We retain existing customers effectively and generate repeat business.",
"I know our customer acquisition cost and lifetime customer value.",
"Our sales process is structured, consistent and effective.",
"We actively collect and act on customer feedback.",
"The business is not overly dependent on word of mouth for growth.",
"We have a documented marketing strategy that we execute consistently.",
],
},
{
id: "operations",
title: "Operations",
code: "04",
description: "Systems, processes, efficiency and execution",
questions: [
"Key business processes are documented and consistently followed.",
"The business can operate effectively without my direct involvement in every task.",
"We have the right tools and technology in place to support the business.",
"Quality is consistent across our products or service delivery.",
"Operational problems are identified and resolved quickly.",
"We have efficient onboarding processes for new staff and clients.",
"Time and resources are not wasted on activities that could be systemised or eliminated.",
"The business has scalable systems that can support growth.",
"Deadlines and commitments are consistently met.",
],
},
{
id: "team",
title: "Team & Leadership",
code: "05",
description: "Performance, accountability, delegation and culture",
questions: [
"My team clearly understands what is expected of them.",
"Accountability is embedded in how the team operates day to day.",
"I have the right people in the right roles within the business.",
"Team performance is reviewed regularly and underperformance is addressed.",
"I delegate effectively and trust my team to execute without micromanagement.",
"Communication within the team is clear, consistent and constructive.",
"The business has a strong culture and the team reflects its values.",
"Staff turnover is not a significant problem for the business.",
"The team is capable of driving results without being dependent on me.",
],
},
{
id: "owner",
title: "Owner Effectiveness",
code: "06",
description: "Focus, decision-making, delegation and owner dependency",
questions: [
"I spend most of my time working on the business rather than in the business.",
"I make decisions quickly and with confidence.",
"My time is focused on high-value activities that drive growth.",
"I have clearly defined my role and have the boundaries to protect it.",
"The business is not over-dependent on me personally to function.",
"I am able to take time away from the business without it suffering.",
"I have a clear plan for my own professional development as a business leader.",
"I am not the primary bottleneck preventing the business from growing.",
"I maintain the energy and focus required to lead the business effectively.",
],
},
];

const RATING_LABELS = {
1: "Strongly Disagree",
2: "Disagree",
3: "Mostly Disagree",
4: "Somewhat Disagree",
5: "Neutral",
6: "Somewhat Agree",
7: "Mostly Agree",
8: "Agree",
9: "Strongly Agree",
10: "Strongly Agree",
};

function trafficLight(score) {
if (score >= 8) return "green";
if (score >= 5) return "amber";
return "red";
}

function trafficLabel(score) {
if (score >= 8) return "Strength";
if (score >= 5) return "Opportunity";
return "Priority";
}

function healthRating(pct) {
if (pct >= 80) return "High Performing";
if (pct >= 65) return "Developing";
if (pct >= 50) return "Under Pressure";
return "At Risk";
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const palette = {
ink: "#1A1A1A",
slate: "#2C3440",
mid: "#5C6370",
muted: "#8C95A0",
rule: "#D4CFC9",
ruleLight: "#EDEAE6",
cream: "#F8F6F2",
paper: "#FFFFFF",
green: "#2D6A4F",
greenLight: "#D8F3DC",
amber: "#B35C00",
amberLight: "#FFF0D6",
red: "#7D1D1D",
redLight: "#FFE8E8",
accent: "#1B4F8A",
accentLight: "#E8F0FB",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body { background: ${palette.cream}; }

.app {
font-family: 'Inter', sans-serif;
color: ${palette.ink};
min-height: 100vh;
background: ${palette.cream};
}

/* HEADER */
.header {
background: ${palette.slate};
padding: 36px 40px 28px;
border-bottom: 3px solid ${palette.accent};
}
.header-eyebrow {
font-size: 10px;
font-weight: 600;
letter-spacing: 0.18em;
text-transform: uppercase;
color: #8CA4C0;
margin-bottom: 10px;
}
.header-title {
font-family: 'Playfair Display', serif;
font-size: clamp(22px, 4vw, 34px);
font-weight: 700;
color: #FFFFFF;
line-height: 1.2;
letter-spacing: -0.01em;
}
.header-subtitle {
font-size: 13px;
color: #8CA4C0;
margin-top: 8px;
font-weight: 400;
line-height: 1.5;
}

/* PROGRESS */
.progress-bar-wrap {
background: ${palette.slate};
padding: 0 40px 24px;
}
.progress-meta {
display: flex;
justify-content: space-between;
font-size: 11px;
color: #8CA4C0;
margin-bottom: 8px;
font-weight: 500;
letter-spacing: 0.05em;
}
.progress-track {
height: 3px;
background: rgba(255,255,255,0.12);
border-radius: 2px;
}
.progress-fill {
height: 100%;
background: ${palette.accent};
border-radius: 2px;
transition: width 0.4s ease;
}

/* SECTION HEADER */
.section-header {
padding: 32px 40px 0;
}
.section-code {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.18em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 6px;
}
.section-title {
font-family: 'Playfair Display', serif;
font-size: clamp(20px, 3vw, 28px);
font-weight: 600;
color: ${palette.ink};
line-height: 1.2;
}
.section-desc {
font-size: 13px;
color: ${palette.mid};
margin-top: 6px;
font-weight: 400;
}
.section-divider {
height: 1px;
background: ${palette.rule};
margin: 24px 40px 0;
}

/* QUESTIONS */
.questions-wrap {
padding: 8px 40px 24px;
}

.question-row {
padding: 24px 0;
border-bottom: 1px solid ${palette.rule};
}
.question-row:last-child { border-bottom: none; }

.question-text {
font-size: 14px;
line-height: 1.6;
color: ${palette.ink};
font-weight: 400;
margin-bottom: 16px;
}
.question-number {
font-size: 11px;
font-weight: 600;
color: ${palette.mid};
letter-spacing: 0.08em;
margin-bottom: 4px;
}

.score-grid {
display: grid;
grid-template-columns: repeat(10, 1fr);
gap: 4px;
}
.score-btn {
aspect-ratio: 1;
border: 1.5px solid ${palette.rule};
background: ${palette.paper};
border-radius: 4px;
font-size: 12px;
font-weight: 600;
color: ${palette.mid};
cursor: pointer;
transition: all 0.15s ease;
display: flex;
align-items: center;
justify-content: center;
font-family: 'Inter', sans-serif;
}
.score-btn:hover {
border-color: ${palette.accent};
color: ${palette.accent};
background: ${palette.accentLight};
}
.score-btn.selected {
background: ${palette.accent};
border-color: ${palette.accent};
color: white;
}
.score-btn.selected-green {
background: ${palette.green};
border-color: ${palette.green};
color: white;
}
.score-btn.selected-amber {
background: ${palette.amber};
border-color: ${palette.amber};
color: white;
}
.score-btn.selected-red {
background: ${palette.red};
border-color: ${palette.red};
color: white;
}
.score-labels {
display: flex;
justify-content: space-between;
margin-top: 6px;
font-size: 10px;
color: ${palette.mid};
font-weight: 500;
letter-spacing: 0.04em;
}

/* NAV BUTTONS */
.nav-wrap {
padding: 20px 40px 40px;
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
}
.btn-primary {
background: ${palette.accent};
color: white;
border: none;
padding: 14px 32px;
font-size: 13px;
font-weight: 600;
letter-spacing: 0.06em;
text-transform: uppercase;
cursor: pointer;
border-radius: 3px;
font-family: 'Inter', sans-serif;
transition: background 0.15s;
}
.btn-primary:hover { background: #163e6e; }
.btn-primary:disabled { background: ${palette.rule}; color: ${palette.mid}; cursor: default; }
.btn-ghost {
background: transparent;
color: ${palette.mid};
border: 1.5px solid ${palette.rule};
padding: 13px 24px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
border-radius: 3px;
font-family: 'Inter', sans-serif;
transition: all 0.15s;
}
.btn-ghost:hover { border-color: ${palette.mid}; color: ${palette.ink}; }
.completion-note {
font-size: 11px;
color: ${palette.mid};
font-style: italic;
}

/* INTRO */
.intro-wrap {
max-width: 700px;
margin: 0 auto;
padding: 48px 40px;
}
.intro-eyebrow {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.18em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 16px;
}
.intro-heading {
font-family: 'Playfair Display', serif;
font-size: clamp(24px, 4vw, 38px);
font-weight: 700;
line-height: 1.2;
color: ${palette.ink};
margin-bottom: 24px;
}
.intro-body {
font-size: 15px;
line-height: 1.75;
color: ${palette.mid};
margin-bottom: 20px;
}
.intro-rule { height: 1px; background: ${palette.rule}; margin: 32px 0; }
.intro-areas {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 12px;
margin-bottom: 36px;
}
.intro-area-item {
display: flex;
align-items: center;
gap: 10px;
font-size: 13px;
font-weight: 500;
color: ${palette.slate};
padding: 12px 14px;
background: ${palette.paper};
border: 1px solid ${palette.rule};
border-radius: 4px;
}
.intro-area-num {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.1em;
color: ${palette.accent};
min-width: 20px;
}
.intro-note {
font-size: 12px;
color: ${palette.mid};
line-height: 1.6;
padding: 16px;
background: ${palette.accentLight};
border-left: 3px solid ${palette.accent};
border-radius: 2px;
margin-bottom: 32px;
}

/* ── REPORT ── */
.report-wrap {
max-width: 880px;
margin: 0 auto;
background: ${palette.paper};
}

/* COVER */
.rpt-cover {
background: ${palette.slate};
padding: 56px 56px 44px;
border-top: 4px solid ${palette.accent};
position: relative;
}
.rpt-cover-stamp {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.22em;
text-transform: uppercase;
color: rgba(255,255,255,0.25);
margin-bottom: 48px;
display: flex;
justify-content: space-between;
}
.rpt-cover-doc {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.2em;
text-transform: uppercase;
color: rgba(255,255,255,0.35);
margin-bottom: 14px;
}
.rpt-cover-title {
font-family: 'Playfair Display', serif;
font-size: clamp(26px, 4vw, 42px);
font-weight: 700;
color: white;
line-height: 1.15;
margin-bottom: 40px;
}
.rpt-cover-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 1px;
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.08);
}
.rpt-cover-cell {
background: rgba(255,255,255,0.04);
padding: 20px 18px;
}
.rcc-label {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.18em;
text-transform: uppercase;
color: rgba(255,255,255,0.3);
margin-bottom: 8px;
}
.rcc-val {
font-family: 'Playfair Display', serif;
font-size: clamp(22px, 3vw, 34px);
font-weight: 700;
color: white;
line-height: 1;
}
.rcc-sub {
font-size: 10px;
color: rgba(255,255,255,0.25);
margin-top: 4px;
}

/* REPORT BODY */
.rpt-body {
padding: 0;
}

/* PAGE SECTIONS — left accent rule */
.rpt-section {
padding: 48px 56px;
border-bottom: 1px solid ${palette.ruleLight};
position: relative;
}
.rpt-section:last-child { border-bottom: none; }
.rpt-section::before {
content: '';
position: absolute;
left: 0;
top: 48px;
bottom: 48px;
width: 3px;
background: ${palette.accent};
opacity: 0.6;
}

.rpt-eyebrow {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.22em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 8px;
}
.rpt-section-title {
font-family: 'Playfair Display', serif;
font-size: clamp(17px, 2.5vw, 22px);
font-weight: 600;
color: ${palette.ink};
padding-bottom: 16px;
border-bottom: 1px solid ${palette.rule};
margin-bottom: 28px;
}

/* SCORECARD TABLE */
.scorecard-table {
width: 100%;
border-collapse: collapse;
font-size: 13px;
margin-bottom: 36px;
}
.scorecard-table th {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.14em;
text-transform: uppercase;
color: ${palette.mid};
padding: 9px 13px;
border-bottom: 2px solid ${palette.rule};
text-align: left;
}
.scorecard-table td {
padding: 15px 13px;
border-bottom: 1px solid ${palette.ruleLight};
vertical-align: middle;
}
.scorecard-table tr:last-child td { border-bottom: none; }
.sc-area { font-weight: 600; font-size: 13px; color: ${palette.ink}; }
.sc-score-cell {
display: flex;
align-items: center;
gap: 8px;
}
.sc-track {
width: 52px;
height: 4px;
background: ${palette.ruleLight};
border-radius: 2px;
overflow: hidden;
flex-shrink: 0;
}
.sc-fill { height: 100%; border-radius: 2px; }
.sc-num {
font-family: 'Playfair Display', serif;
font-size: 16px;
font-weight: 700;
color: ${palette.ink};
white-space: nowrap;
}
.sc-interp { font-size: 13px; color: ${palette.mid}; line-height: 1.6; }

/* TRAFFIC BADGE */
.traffic-badge {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
padding: 3px 10px;
border-radius: 2px;
white-space: nowrap;
}
.badge-green { background: ${palette.greenLight}; color: ${palette.green}; }
.badge-amber { background: ${palette.amberLight}; color: ${palette.amber}; }
.badge-red { background: ${palette.redLight}; color: ${palette.red}; }

/* INSIGHT CARDS */
.insight-grid { display: flex; flex-direction: column; gap: 12px; }
.insight-card {
padding: 17px 20px;
border-left: 3px solid;
border-radius: 0 2px 2px 0;
}
.insight-card-green { background: ${palette.greenLight}; border-color: ${palette.green}; }
.insight-card-amber { background: ${palette.amberLight}; border-color: ${palette.amber}; }
.insight-card-red { background: ${palette.redLight}; border-color: ${palette.red}; }
.insight-title { font-size: 12px; font-weight: 700; margin-bottom: 5px; }
.insight-body { font-size: 13px; line-height: 1.65; color: ${palette.slate}; }

/* THEME BLOCKS */
.theme-block {
padding-bottom: 32px;
margin-bottom: 32px;
border-bottom: 1px solid ${palette.ruleLight};
}
.theme-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.theme-name {
font-family: 'Playfair Display', serif;
font-size: 16px;
font-weight: 600;
color: ${palette.ink};
margin-bottom: 10px;
}
.theme-body { font-size: 13px; line-height: 1.75; color: ${palette.mid}; margin-bottom: 16px; }
.theme-qs-label {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.18em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 10px;
}
.theme-q {
font-size: 13px;
color: ${palette.slate};
line-height: 1.6;
padding: 5px 0 5px 18px;
position: relative;
}
.theme-q::before { content: '—'; position: absolute; left: 0; color: ${palette.accent}; font-weight: 700; }

/* REFLECTION */
.reflection-intro {
font-size: 13px;
line-height: 1.75;
color: ${palette.mid};
padding: 16px 20px;
background: ${palette.accentLight};
border-left: 3px solid ${palette.accent};
margin-bottom: 32px;
}
.rq-item { margin-bottom: 28px; }
.rq-num {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.16em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 4px;
}
.rq-text { font-size: 14px; font-weight: 600; color: ${palette.ink}; margin-bottom: 12px; line-height: 1.5; }
.rq-line { height: 34px; border-bottom: 1px solid ${palette.ruleLight}; }

/* SESSION 2 */
.session-split {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1px;
background: ${palette.rule};
border: 1px solid ${palette.rule};
margin-bottom: 28px;
}
.ss-cell { background: ${palette.paper}; padding: 22px 24px; }
.ss-label {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.18em;
text-transform: uppercase;
color: ${palette.mid};
margin-bottom: 8px;
}
.ss-heading {
font-family: 'Playfair Display', serif;
font-size: 16px;
font-weight: 700;
color: ${palette.ink};
line-height: 1.3;
}
.session-goals {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1px;
background: ${palette.rule};
border: 1px solid ${palette.rule};
}
.sg-item { background: ${palette.paper}; padding: 14px 18px; font-size: 13px; color: ${palette.mid}; }

/* FOOTER */
.rpt-footer {
background: ${palette.slate};
padding: 24px 56px;
display: flex;
justify-content: space-between;
align-items: center;
}
.rpt-footer-brand {
font-family: 'Playfair Display', serif;
font-size: 14px;
font-weight: 600;
color: white;
}
.rpt-footer-sub { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 3px; }
.rpt-footer-right { font-size: 10px; color: rgba(255,255,255,0.3); text-align: right; line-height: 1.8; }

.rpt-actions { padding: 24px 56px 40px; display: flex; gap: 12px; }
.print-btn {
background: ${palette.accent};
color: white;
border: none;
padding: 12px 24px;
font-size: 11px;
font-weight: 700;
letter-spacing: 0.08em;
text-transform: uppercase;
cursor: pointer;
border-radius: 2px;
font-family: 'Inter', sans-serif;
transition: background 0.15s;
}
.print-btn:hover { background: #12294A; }

/* ── EMAIL GATE ── */
.gate-wrap {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
background: ${palette.cream};
padding: 32px 20px;
}
.gate-card {
background: ${palette.paper};
border: 1px solid ${palette.rule};
border-top: 4px solid ${palette.accent};
border-radius: 3px;
padding: 48px 44px;
max-width: 480px;
width: 100%;
}
.gate-eyebrow {
font-size: 9px;
font-weight: 700;
letter-spacing: 0.22em;
text-transform: uppercase;
color: ${palette.accent};
margin-bottom: 14px;
}
.gate-heading {
font-family: 'Playfair Display', serif;
font-size: clamp(20px, 3vw, 26px);
font-weight: 700;
color: ${palette.ink};
line-height: 1.2;
margin-bottom: 10px;
}
.gate-sub {
font-size: 13px;
color: ${palette.mid};
line-height: 1.65;
margin-bottom: 32px;
}
.gate-rule { height: 1px; background: ${palette.rule}; margin: 28px 0; }
.gate-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.gate-label {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
color: ${palette.mid};
}
.gate-input {
background: ${palette.cream};
border: 1.5px solid ${palette.rule};
border-radius: 2px;
padding: 11px 14px;
font-size: 14px;
font-family: 'Inter', sans-serif;
color: ${palette.ink};
transition: border-color 0.15s;
width: 100%;
}
.gate-input:focus { outline: none; border-color: ${palette.accent}; background: ${palette.paper}; }
.gate-input::placeholder { color: ${palette.muted}; }
.gate-btn {
width: 100%;
background: ${palette.accent};
color: white;
border: none;
padding: 14px;
font-size: 12px;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
cursor: pointer;
border-radius: 2px;
font-family: 'Inter', sans-serif;
margin-top: 8px;
transition: background 0.15s;
}
.gate-btn:hover { background: #12294A; }
.gate-btn:disabled { background: ${palette.rule}; color: ${palette.muted}; cursor: default; }
.gate-privacy {
font-size: 11px;
color: ${palette.muted};
text-align: center;
margin-top: 14px;
line-height: 1.5;
}
.gate-status {
font-size: 12px;
color: ${palette.mid};
text-align: center;
margin-top: 10px;
min-height: 18px;
}
.gate-status.error { color: ${palette.red}; }

/* KEY FINDINGS */
.kf-grid { display: flex; flex-direction: column; gap: 1px; background: ${palette.rule}; border: 1px solid ${palette.rule}; }
.kf-row { display: grid; grid-template-columns: 180px 1fr; background: ${palette.paper}; }
.kf-label {
padding: 22px 20px;
font-size: 10px;
font-weight: 700;
letter-spacing: 0.14em;
text-transform: uppercase;
color: white;
display: flex;
align-items: center;
}
.kf-label-constraint { background: ${palette.red}; }
.kf-label-strength { background: ${palette.green}; }
.kf-label-opportunity { background: ${palette.accent}; }
.kf-value {
padding: 22px 24px;
font-size: 14px;
font-weight: 600;
color: ${palette.ink};
line-height: 1.45;
display: flex;
align-items: center;
}

@media (max-width: 600px) {
.header, .progress-bar-wrap, .section-header, .questions-wrap, .nav-wrap { padding-left: 20px; padding-right: 20px; }
.section-divider { margin-left: 20px; margin-right: 20px; }
.score-grid { gap: 3px; }
.score-btn { font-size: 11px; }
.intro-wrap { padding: 32px 20px; }
.intro-areas { grid-template-columns: 1fr; }
.rpt-cover { padding: 32px 24px 28px; }
.rpt-cover-grid { grid-template-columns: 1fr 1fr; }
.rpt-section { padding: 36px 24px; }
.rpt-section::before { top: 36px; bottom: 36px; }
.scorecard-table th:nth-child(3), .scorecard-table td:nth-child(3) { display: none; }
.session-split, .session-goals { grid-template-columns: 1fr; }
.rpt-footer { flex-direction: column; gap: 12px; padding: 20px 24px; }
.rpt-actions { padding: 20px 24px 36px; flex-direction: column; }
.gate-card { padding: 36px 24px; }
.kf-row { grid-template-columns: 1fr; }
.kf-label { padding: 10px 16px; }
}

@media print {
.nav-wrap, .progress-bar-wrap, .rpt-actions, .gate-wrap { display: none; }
body { background: white; }
.rpt-section { page-break-inside: avoid; }
}
`;

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────────────────────

// Scorecard interpretations: cross-contextual where possible, not just single-area descriptions
const AREA_INTERPRETATIONS = {
direction: {
strong: { label: "Well Developed", body: "Strategic intent appears to be a genuine operating principle rather than a stated ambition. Decisions have a coherent basis, which matters most when the business is under pressure to react — the owner is less likely to be pulled off course by short-term demands." },
mid: { label: "Moderately Developed", body: "Strategic thinking is present but may not yet be sufficiently embedded to govern day-to-day decisions. This often surfaces not as a lack of vision, but as a gap between what the owner intends and what the business actually prioritises." },
weak: { label: "Requires Attention", body: "The absence of a clear operating direction means the business is likely being shaped more by incoming demands than by deliberate choices. This is worth examining carefully — it tends to compound over time, making it progressively harder to focus effort where it matters most." },
},
financial: {
strong: { label: "Well Developed", body: "Financial visibility at this level allows the owner to make commercial decisions with a degree of confidence that many businesses at a comparable stage do not have. Pricing, investment and timing decisions are all materially better when grounded in reliable data." },
mid: { label: "Moderately Developed", body: "Some financial awareness is in place, but the gaps — whether in reporting frequency, margin clarity or cash flow visibility — are likely creating uncertainty at the moments when clear information matters most. This often shows up as delayed decisions or pricing that hasn't kept pace with costs." },
weak: { label: "Requires Attention", body: "Limited financial visibility is one of the more consequential gaps a business can carry. It is not simply a reporting issue — it affects every commercial decision the owner makes, from pricing to hiring to knowing when the business can afford to grow." },
},
customers: {
strong: { label: "Well Developed", body: "A consistent commercial engine is one of the most valuable assets a business can have. The ability to generate and retain customers reliably reduces the volatility that makes planning difficult — and gives the owner genuine commercial leverage." },
mid: { label: "Moderately Developed", body: "Customer activity exists but may be more a product of reputation and relationships than of structured acquisition. This is common in businesses that have grown organically — and it tends to feel sustainable right up until the point where it isn't." },
weak: { label: "Requires Attention", body: "Inconsistent customer acquisition creates a constraint that ripples through every other part of the business. It makes financial forecasting unreliable, limits investment confidence and often results in the owner personally bridging the gap — at significant cost to their time and focus." },
},
operations: {
strong: { label: "Well Developed", body: "Operational consistency at this level suggests the business has moved beyond depending on specific individuals to deliver. This is a harder capability to build than most owners expect — and its presence creates meaningful options around growth, delegation and margin protection." },
mid: { label: "Moderately Developed", body: "Core operations are functional, but the reliance on individual knowledge over documented systems creates latent risk. Businesses in this position typically don't notice the cost until they try to hire, delegate or grow — at which point the informal nature of operations becomes a constraint." },
weak: { label: "Requires Attention", body: "Operational informality tends to concentrate delivery risk in a small number of people — usually the owner. This creates a compounding problem: the more the business grows, the more visible the operational gaps become, and the more the owner's capacity is consumed by managing the consequences." },
},
team: {
strong: { label: "Well Developed", body: "A team that operates with clear expectations and genuine accountability is an asset that directly extends the owner's capacity. It means the owner can direct energy toward growth and strategy rather than managing operational performance by default." },
mid: { label: "Moderately Developed", body: "Team foundations are in place, but the accountability structures may not yet be embedded enough to sustain performance without the owner's direct involvement. This is a common ceiling point — the team performs well when the owner is present, less reliably when they are not." },
weak: { label: "Requires Attention", body: "Where team accountability is underdeveloped, the owner typically absorbs the consequences — managing performance issues, resolving problems that should sit elsewhere, and providing direction that the team structure should be providing. The commercial cost of this is rarely visible on a P&L, but it is significant." },
},
owner: {
strong: { label: "Well Developed", body: "An owner operating at this level of effectiveness is a meaningful indicator of business maturity — not because they are working harder, but because the business has developed enough structure to allow them to focus on what actually creates value. This position is harder to reach than most assume." },
mid: { label: "Moderately Developed", body: "The owner is likely navigating a familiar tension: the business needs their strategic input, but their time is being consumed by operational demands that haven't yet found another home. This is often a sign the business has outgrown its current structure — not that the owner is managing poorly." },
weak: { label: "Requires Attention", body: "An owner absorbed in daily operations is typically a symptom of other things — underdeveloped systems, a team that needs more direction than it should, or a business that has grown faster than its structure. The cost is not just workload. It is the strategic thinking that doesn't happen because the owner is occupied elsewhere." },
},
};

// ── CROSS-CATEGORY PATTERN ENGINE ────────────────────────────────────────────

const PATTERNS = [
{
id: "owner_ops_team_lock",
name: "The Owner as the Business",
match: (s) => s.owner < 6 && s.operations < 6 && s.team < 6,
weight: (s) => (18 - s.owner - s.operations - s.team),
observation: (s) => `Owner Effectiveness (${s.owner.toFixed(1)}), Operations (${s.operations.toFixed(1)}) and Team & Leadership (${s.team.toFixed(1)}) are the three lowest-scoring areas in this assessment — and their simultaneous weakness is not coincidental. When a business has informal processes, a team that requires significant direction, and an owner who is absorbed in daily operations, these three dynamics reinforce each other. The team fills gaps through the owner; the owner fills gaps through personal effort; and the business runs on the owner's presence rather than through its own structure. The commercial implication is a hard ceiling: the business cannot grow faster than the owner's personal capacity, and it is more fragile than its revenue figures suggest. This pattern is one of the most common in owner-operated businesses at this stage — and one of the most consequential to leave unaddressed.`,
questions: [
"Which tasks or decisions have ended up with the owner not because they require the owner, but because no one else has been set up to handle them?",
"If the owner was unavailable for three weeks, which parts of the business would deteriorate — and why?",
"What would the owner need to stop doing in order to operate at the level the business actually requires from them?",
"Is the current team structure genuinely designed to reduce owner dependency, or has it evolved around the owner's presence?",
],
},
{
id: "growth_without_profit",
name: "Revenue Activity Without Financial Clarity",
match: (s) => s.customers >= 6.5 && s.financial < 5.5,
weight: (s) => s.customers - s.financial + 2,
observation: (s) => `Customers & Marketing scores well (${s.customers.toFixed(1)}), but Financial Performance (${s.financial.toFixed(1)}) is comparatively underdeveloped. This combination appears more often than might be expected: a business that is good at generating revenue but does not yet have the financial visibility to know how profitably it is doing so. The risk is not that the business is failing commercially — it clearly has some commercial capability. The risk is that growth is being pursued without a clear picture of the margin it is generating, the cash it is consuming, or whether the revenue mix is actually moving the business toward a stronger financial position. Busy and profitable are not the same thing, and without reliable financial data, it is difficult to know which one applies.`,
questions: [
"Does the business know which customers, products or services generate its best margin — and is it actively focusing on those?",
"Is the business growing revenue in ways that improve profitability, or simply in ways that create more activity?",
"What would change about commercial decisions if the owner had a clear monthly view of margin by product or service line?",
"Has pricing kept pace with costs, or has the business absorbed margin compression without fully recognising it?",
],
},
{
id: "strong_sales_weak_delivery",
name: "Commercial Strength, Operational Fragility",
match: (s) => s.customers >= 6.5 && s.operations < 5.5,
weight: (s) => s.customers - s.operations + 1.5,
observation: (s) => `The assessment shows a notable gap between Customers & Marketing (${s.customers.toFixed(1)}) and Operations (${s.operations.toFixed(1)}). The business is effective at generating demand but may not yet have the operational infrastructure to deliver on that demand consistently. This is a commercially precarious position: the ability to win customers is an asset; the ability to retain them depends on what happens after the sale. Where operational systems are informal, delivery quality tends to be variable — and variable delivery erodes the commercial reputation that brought customers in the first place. Businesses in this position often find that growth accelerates the problem, because more volume amplifies every operational gap.`,
questions: [
"Where does delivery quality most commonly fall short of what was promised or expected?",
"Is the current operational structure capable of handling a 30% increase in volume without a proportional increase in owner involvement?",
"Are there customers or clients the business has lost — or nearly lost — where the root cause was delivery rather than commercial?",
"What is the relationship between the business's ability to win work and its ability to deliver it profitably?",
],
},
{
id: "direction_execution_gap",
name: "Intention Ahead of Infrastructure",
match: (s) => s.direction >= 6.5 && (s.operations < 5.5 || s.team < 5.5),
weight: (s) => s.direction - Math.min(s.operations, s.team),
observation: (s) => `Direction & Strategy scores well (${s.direction.toFixed(1)}), but ${s.operations < s.team ? `Operations (${s.operations.toFixed(1)})` : `Team & Leadership (${s.team.toFixed(1)})`} — the infrastructure through which strategy is actually delivered — scores significantly lower. This gap between strategic intent and execution capability is one of the more frustrating positions for an owner to be in: the direction is clear, but the business keeps falling short of it. Plans are made but not fully implemented. Priorities are set but not consistently followed. This is rarely a planning problem — it is usually a structural one. The business has not yet developed the systems or team accountability required to translate intention into reliable action.`,
questions: [
"What typically happens to priorities and plans when the business gets busy or faces unexpected demands?",
"Does the team understand the business's direction well enough to make decisions aligned with it when the owner is not present?",
"Where does the gap between what the business intends to do and what it actually does show up most visibly?",
"What would need to change structurally for the business's strategic intentions to translate into consistent execution?",
],
},
{
id: "exhausted_owner",
name: "High-Performing Business, Stretched Owner",
match: (s) => {
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
return avg >= 6.5 && s.owner < 5.5;
},
weight: (s) => {
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
return avg - s.owner + 2;
},
observation: (s) => `The overall assessment reflects a business with genuine capability across most areas — but Owner Effectiveness (${s.owner.toFixed(1)}) is a clear outlier on the low side. This is a pattern worth naming directly: the business appears to be performing well, but at a personal cost to the owner that may not be sustainable. In many cases, businesses in this position have reached their current level of performance because the owner has compensated for structural gaps through personal effort. The business works — but the owner is carrying more of it than is appropriate. This becomes consequential not just as a quality-of-life issue, but as a commercial one: an owner who is stretched has less capacity for the strategic thinking and relationship-building that typically drive the next phase of growth.`,
questions: [
"Is the current level of owner involvement a deliberate choice, or has it accumulated by default over time?",
"Which parts of the owner's role are genuinely strategic, and which are operational by habit or necessity?",
"What would need to change for the owner to reduce their personal workload without reducing business performance?",
"Has the business's growth been creating more leverage for the owner, or more demand on them?",
],
},
{
id: "team_exceeds_systems",
name: "Strong Team, Weak Systems",
match: (s) => s.team >= 7 && s.operations < 5.5,
weight: (s) => s.team - s.operations,
observation: (s) => `Team & Leadership scores well (${s.team.toFixed(1)}), but Operations (${s.operations.toFixed(1)}) is comparatively underdeveloped. This is an unusual combination — a capable team operating without the systems and processes that would allow their capability to be deployed consistently. The risk here is not immediately obvious: the team compensates for the absence of systems through their own knowledge and judgement, which works until someone leaves, the business grows beyond their individual capacity, or the owner is no longer available to bridge the gaps. A capable team without strong operational infrastructure is like a skilled workforce without reliable tools — the output is good, but more variable and more dependent on individual effort than it needs to be.`,
questions: [
"How much of the team's effectiveness depends on their personal knowledge rather than documented processes?",
"What would happen to delivery quality and consistency if one or two key team members were unavailable?",
"Are there areas where the team performs well individually but the output is inconsistent because there is no agreed system to follow?",
"What is preventing the business from formalising what the team already knows how to do?",
],
},
{
id: "capability_without_direction",
name: "Execution Capability Without Strategic Anchor",
match: (s) => s.operations >= 6.5 && s.team >= 6.5 && s.direction < 5.5,
weight: (s) => (s.operations + s.team) / 2 - s.direction,
observation: (s) => `Operations (${s.operations.toFixed(1)}) and Team & Leadership (${s.team.toFixed(1)}) are genuine strengths — but Direction & Strategy (${s.direction.toFixed(1)}) is underdeveloped. This means the business has built real execution capability without a clearly defined strategic anchor for it. The team can deliver; the question is whether what they are delivering is aligned with the highest-value version of what the business could be doing. This pattern sometimes reflects a business that has grown through responsiveness — taking on work as it arrives, building capability to handle it, but not yet stepping back to determine whether that work represents the best use of the business's capacity. A clear strategic direction would not change what the business can do. It would change what it chooses to do with that capability.`,
questions: [
"Is the business currently focused on the highest-value work it is capable of, or is it largely focused on the work that has always arrived?",
"How deliberately has the business chosen its current market position, customer base and service mix?",
"If the business had to turn down 20% of its current work, which 20% would it choose — and what does that reveal about its actual priorities?",
"What would change about how the team's capability is deployed if the business had a clearly defined 12-month direction?",
],
},
{
id: "financial_without_customers",
name: "Financial Clarity, Unstructured Revenue",
match: (s) => s.financial >= 7 && s.customers < 5.5,
weight: (s) => s.financial - s.customers,
observation: (s) => `Financial Performance scores well (${s.financial.toFixed(1)}), but Customers & Marketing (${s.customers.toFixed(1)}) is notably lower. The business understands its financial position — but may not have a reliable or structured approach to generating the revenue that underpins it. This creates a specific kind of commercial risk: the owner can see the numbers clearly, but has limited control over how predictably they arrive. In many businesses where this pattern appears, revenue is largely dependent on the owner's personal relationships, reputation or direct business development effort — which is effective up to a point, but is not scalable and is not transferable. The question worth examining is whether the current revenue base is a genuine commercial engine or a set of relationships that have produced consistent results so far but could be more fragile than they appear.`,
questions: [
"How much of the current revenue would be at risk if the owner stepped back from direct client relationships for six months?",
"Is there a documented approach to generating new business, or does it largely depend on the owner's network and visibility?",
"How predictable is the pipeline — and what is that prediction based on?",
"What would a structured, owner-independent approach to customer acquisition require the business to develop?",
],
},
{
id: "plateaued_maturity",
name: "Stable but Plateaued",
match: (s) => {
const vals = [s.direction,s.financial,s.customers,s.operations,s.team,s.owner];
const avg = vals.reduce((a,b)=>a+b,0)/6;
const spread = Math.max(...vals) - Math.min(...vals);
return avg >= 5.5 && avg < 7 && spread < 2.5;
},
weight: (s) => {
const vals = [s.direction,s.financial,s.customers,s.operations,s.team,s.owner];
const spread = Math.max(...vals) - Math.min(...vals);
return 4 - spread; // tighter = higher weight
},
observation: (s) => `The assessment shows a notably consistent profile: scores across all six areas fall within a relatively tight range, and the overall result sits in the mid-band. This pattern — consistent, moderate scores without dramatic peaks or troughs — often reflects a business that has reached a point of stable functionality. It runs. It generates revenue. It is not in crisis. But it may also be plateauing. Businesses in this position have typically developed enough structure to operate, but not enough to accelerate. The absence of low scores means there are no obvious fires to fight. The absence of high scores means there are no clear platforms to build from. The most important question at this stage is often not about the business's weaknesses, but about whether the owner has a clear ambition for what comes next — and what would need to change to pursue it.`,
questions: [
"Is the business growing, stable or quietly declining — and is the owner satisfied with the answer?",
"Where has the business stopped improving, and when did that stop feel acceptable rather than temporary?",
"What would it take for the business to move from performing adequately to performing at a distinctly higher level?",
"Is the current trajectory the result of deliberate choices, or has the business settled into a pattern that no one has actively decided on?",
],
},
{
id: "founder_dependence_high_performer",
name: "Founder Dependence Despite Strong Performance",
match: (s) => {
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
return avg >= 6.5 && s.owner < 5.5 && (s.operations < 6 || s.team < 6);
},
weight: (s) => {
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
return avg - (s.owner + Math.min(s.operations, s.team))/2;
},
observation: (s) => `The business is performing well across several areas — but the combination of a lower Owner Effectiveness score (${s.owner.toFixed(1)}) with relatively underdeveloped ${s.operations < s.team ? `Operations (${s.operations.toFixed(1)})` : `Team accountability (${s.team.toFixed(1)})`} suggests the business's performance may be more dependent on the owner's personal involvement than its overall score implies. This is a specific kind of risk that high-performing businesses can carry for some time before it becomes visible: the business looks strong from the outside, but the owner is the load-bearing wall. If the owner's capacity changes — through illness, a change in personal circumstances, or simply the ambition to step back — the structural dependency becomes apparent quickly. The more relevant question is not whether the business is performing, but whether it is performing in a way that is sustainable and scalable without the owner at the centre of it.`,
questions: [
"If an investor or prospective buyer examined the business, how dependent would they assess it to be on the owner's personal involvement?",
"What parts of the business's performance are genuinely structural, and what parts are the owner personally compensating for?",
"Has the owner's personal involvement in the business increased, decreased or stayed the same as the business has grown?",
"What is the owner's long-term intention for their role in the business — and does the current structure support that intention?",
],
},
{
id: "commercial_gap",
name: "Underdeveloped Commercial Infrastructure",
match: (s) => s.customers < 5.5 && s.financial < 5.5,
weight: (s) => (11 - s.customers - s.financial),
observation: (s) => `Both Customers & Marketing (${s.customers.toFixed(1)}) and Financial Performance (${s.financial.toFixed(1)}) score in the lower range — and these two areas are more interdependent than they might appear. Without a consistent approach to customer acquisition, financial forecasting is largely speculative. Without financial clarity, it is difficult to make confident decisions about where to invest in growth. Together, they suggest the business may be operating without a reliable commercial engine: revenue arrives, but not predictably enough to plan around, and the financial picture is not clear enough to know whether the business is moving in the right direction. This is a common position in businesses that have grown through the owner's personal effort and relationships — and it tends to become more limiting as the business matures.`,
questions: [
"How confident is the owner in the business's revenue for the next six months — and what is that confidence based on?",
"Is the current approach to generating new business deliberate, or has it largely evolved without being designed?",
"Does the owner know, with reasonable confidence, whether the business is becoming more or less profitable over time?",
"What would need to be true commercially for the owner to feel the business was on a genuinely strong footing?",
],
},
{
id: "leadership_without_leverage",
name: "Strategic Owner, Underequipped Team",
match: (s) => s.owner >= 7 && s.team < 5.5,
weight: (s) => s.owner - s.team,
observation: (s) => `Owner Effectiveness scores well (${s.owner.toFixed(1)}), but Team & Leadership (${s.team.toFixed(1)}) is comparatively underdeveloped. An owner operating at a strategic level but leading a team without strong accountability structures faces a specific challenge: their capacity to think and act strategically is not being translated into business-wide performance. The owner may be effective; the question is whether that effectiveness is being leveraged through the team or simply accumulated personally. In many cases, this pattern results in the owner gradually pulling back toward an operational role — not because they choose to, but because the team's performance requires it. The consequence is that the strategic capacity the owner has developed does not generate the business results it should.`,
questions: [
"Does the team's performance reflect the standards the owner holds for the business, or is there a gap the owner has stopped actively addressing?",
"What accountability structures exist to ensure performance issues are identified and addressed without the owner having to discover them directly?",
"How much of the owner's time is currently being consumed by team management that should not require their involvement?",
"Is the current team capable of executing the business's ambitions at the level the owner intends — or is there a capability gap that has been accommodated rather than resolved?",
],
},
{
id: "broad_early_stage",
name: "A Business Building Its Foundations",
match: (s) => {
const vals = [s.direction,s.financial,s.customers,s.operations,s.team,s.owner];
return vals.filter(v=>v<5.5).length >= 4;
},
weight: (s) => {
const vals = [s.direction,s.financial,s.customers,s.operations,s.team,s.owner];
return vals.filter(v=>v<5.5).length * 1.5;
},
observation: (s) => {
const vals = {direction:s.direction,financial:s.financial,customers:s.customers,operations:s.operations,team:s.team,owner:s.owner};
const sorted = Object.entries(vals).sort((a,b)=>a[1]-b[1]);
const weakest = sorted[0];
const areaNames = {direction:"Direction & Strategy",financial:"Financial Performance",customers:"Customers & Marketing",operations:"Operations",team:"Team & Leadership",owner:"Owner Effectiveness"};
return `The majority of areas in this assessment score in the lower range, which reflects a business in an early stage of structural development. This is not a crisis — it is a stage. Most of the businesses that eventually become well-run, profitable enterprises pass through a period that looks broadly like this. The challenge at this stage is not identifying what needs attention; the answer to that question is relatively clear. The more important — and more difficult — question is sequencing: determining which improvement will create the most leverage across the others. In this assessment, ${areaNames[weakest[0]]} (${weakest[1].toFixed(1)}) scores lowest and is likely creating downstream effects on several other areas. The most productive starting point is usually the constraint that, once addressed, makes the most other things easier — not the most obvious problem or the most urgent one.`;
},
questions: [
"Which area of the business, if strengthened, would have the most positive effect on everything else?",
"What has been the primary focus of the owner's time and energy over the past 12 months — and has that focus produced the intended result?",
"Where is the business most vulnerable right now, and what is the consequence of leaving that vulnerability unaddressed?",
"What does the owner most need to be different in the next 12 months — commercially, operationally and personally?",
],
},
{
id: "high_performer_inflection",
name: "Approaching the Ceiling of Current Structure",
match: (s) => {
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
const vals = [s.direction,s.financial,s.customers,s.operations,s.team,s.owner];
const spread = Math.max(...vals) - Math.min(...vals);
return avg >= 7 && spread < 3;
},
weight: (s) => (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6,
observation: (s) => {
const vals = {direction:s.direction,financial:s.financial,customers:s.customers,operations:s.operations,team:s.team,owner:s.owner};
const sorted = Object.entries(vals).sort((a,b)=>a[1]-b[1]);
const areaNames = {direction:"Direction & Strategy",financial:"Financial Performance",customers:"Customers & Marketing",operations:"Operations",team:"Team & Leadership",owner:"Owner Effectiveness"};
return `The assessment reflects a business operating at a genuinely high level across most areas. This is not a common result — and it warrants a different kind of conversation than most diagnostic assessments prompt. At this level of overall performance, the limiting factors are rarely obvious and rarely fixable through the same kind of effort that built the business to this point. The most consequential question is no longer "what needs to be improved?" but "what does the next phase of this business actually look like — and does the current structure support it?" ${areaNames[sorted[0][0]]} (${sorted[0][1].toFixed(1)}) is the relative outlier in an otherwise strong profile, and in a business performing at this level, even a single underdeveloped area can act as a disproportionate constraint. The advisory work ahead is less about fixing problems and more about making deliberate choices about where the business goes next.`;
},
questions: [
"Is the business's current trajectory the result of deliberate decisions, or has it largely built its own momentum?",
"What is the single most significant constraint on achieving the next level of performance — and has that constraint been directly addressed?",
"Has the business's ambition kept pace with its capability, or has growth been absorbed without a corresponding increase in strategic intent?",
"What would need to be true for the owner to feel the business was genuinely working for them — commercially and personally?",
],
},
];

// Pattern selector — matches, weights, returns top 3 most relevant
function selectPatterns(scores) {
const s = {
direction: scores.find(x=>x.id==="direction")?.avg ?? 5,
financial: scores.find(x=>x.id==="financial")?.avg ?? 5,
customers: scores.find(x=>x.id==="customers")?.avg ?? 5,
operations: scores.find(x=>x.id==="operations")?.avg ?? 5,
team: scores.find(x=>x.id==="team")?.avg ?? 5,
owner: scores.find(x=>x.id==="owner")?.avg ?? 5,
};
const matched = PATTERNS
.filter(p => p.match(s))
.map(p => ({ ...p, score: p.weight(s), resolvedObs: p.observation(s) }))
.sort((a,b) => b.score - a.score);
return matched.slice(0, 3);
}

// Executive commentary: identifies the dominant business dynamic, not just score levels
function buildExecCommentary(sectionScores, pct) {
const s = Object.fromEntries(sectionScores.map(x=>[x.id, x.avg]));
const vals = sectionScores.map(x=>x.avg);
const spread = Math.max(...vals) - Math.min(...vals);
const sorted = [...sectionScores].sort((a,b)=>b.avg-a.avg);
const bot1 = sorted[sorted.length-1];
const bot2 = sorted[sorted.length-2];

// Primary diagnostic: what is the most likely constraint right now?
// This reads combinations, not individual scores
let constraint;
const ownerOpsTeamLow = s.owner < 6 && s.operations < 6 && s.team < 6;
const highPerformerLowOwner = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6 >= 6.5 && s.owner < 5.5;
const commercialGap = s.customers < 5.5 && s.financial < 5.5;
const directionExecGap = s.direction >= 6.5 && (s.operations < 5.5 || s.team < 5.5);
const highCustomersLowOps = s.customers >= 6.5 && s.operations < 5.5;
const avg = (s.direction+s.financial+s.customers+s.operations+s.team+s.owner)/6;
const tightMid = avg >= 5.5 && avg < 7 && spread < 2.5;

if (ownerOpsTeamLow) {
constraint = `The most significant pattern in this assessment is the combination of lower scores across Owner Effectiveness, Operations and Team & Leadership. Together, these suggest the business is currently running through the owner's personal involvement rather than through independent structure. This is the constraint most likely to be limiting growth capacity — and the one Session 2 should examine first.`;
} else if (highPerformerLowOwner) {
constraint = `The business is performing well across most areas, but Owner Effectiveness is a notable exception. This pattern — strong business, stretched owner — often reflects a business that has grown faster than its structure, leaving the owner personally compensating for gaps that should sit elsewhere. The key question for Session 2 is whether the business's performance is genuinely structural, or whether the owner is the load-bearing wall.`;
} else if (commercialGap) {
constraint = `The assessment identifies both customer acquisition and financial visibility as underdeveloped areas. These two gaps are commercially interdependent: without predictable revenue, financial planning is largely speculative; without financial clarity, investment decisions lack a reliable basis. Together, they represent the business's most pressing commercial development need.`;
} else if (highCustomersLowOps) {
constraint = `The business demonstrates genuine commercial capability — but operational infrastructure has not kept pace. The ability to generate demand is an asset; the ability to deliver on it consistently, at margin, is what converts that demand into a profitable business. This gap between commercial strength and operational development is likely to widen under growth pressure.`;
} else if (directionExecGap) {
constraint = `The assessment reveals a gap between strategic clarity and execution capability. Direction scores well; the infrastructure to deliver on it does not. This often means plans are made but not consistently implemented — a frustrating position that typically reflects a structural issue rather than a motivation or management one.`;
} else if (tightMid) {
constraint = `The most notable feature of this assessment is its consistency: scores are tightly clustered in the mid-range across all six areas. This profile often reflects a business that is functional and stable, but may be plateauing. There are no obvious em
