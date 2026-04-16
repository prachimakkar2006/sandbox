import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Check, Save, Send } from 'lucide-react';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { useRecruiter } from '../../context/RecruiterContext';

const STEPS = ['Basics', 'Rounds', 'Grading', 'Candidates', 'Review'];
const DOMAINS = ['DSA', 'Web Dev', 'AI/ML', 'Data Science', 'System Design', 'General'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const TOPICS = {
  DSA: ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting', 'Hashing', 'Recursion', 'Linked Lists'],
  'Web Dev': ['HTML/CSS', 'React', 'Node.js', 'REST APIs', 'Databases', 'Auth', 'TypeScript'],
  'AI/ML': ['Python', 'NumPy', 'Pandas', 'ML Algorithms', 'Neural Networks', 'NLP', 'CV'],
  'Data Science': ['Statistics', 'SQL', 'Visualization', 'Regression', 'Clustering', 'A/B Testing'],
  'System Design': ['Scalability', 'Caching', 'Load Balancing', 'Microservices', 'Databases', 'APIs'],
  General: ['Logic', 'Aptitude', 'Communication', 'Problem Solving'],
};

const inputCls = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-colors";
const labelCls = "text-xs text-text-secondary mb-1.5 block";

const Toggle = ({ value, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer select-none">
    <span className="text-sm text-text-secondary">{label}</span>
    <div onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${value ? 'bg-primary' : 'bg-dark-border'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} style={{ backgroundColor: '#fff' }} />
    </div>
  </label>
);

const Chip = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${active ? 'bg-primary/10 text-primary border-primary/30' : 'border-dark-border text-text-secondary hover:border-primary/20 hover:text-slate-900'}`}>
    {label}
  </button>
);

const SectionCard = ({ title, children, enabled, onToggle }) => (
    <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-slate-900 font-semibold text-sm">{title}</h3>
      {onToggle && <Toggle value={enabled} onChange={onToggle} label="" />}
    </div>
    {children}
  </div>
);

export default function AssessmentBuilder() {
  const { recruiter, logout } = useRecruiter();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(null);

  const [form, setForm] = useState({
    title: '', targetRole: '', domain: 'General', difficulty: 'Intermediate',
    timeLimit: 60, description: '', tags: '',
    rounds: {
      round1: { enabled: true, questionCount: 10, topics: [], timePerQuestion: 60, useQuestionBank: true },
      round2: { enabled: true, questionCount: 3, type: 'Mixed', evaluationCriteria: [], customInstructions: '' },
      round3: { enabled: true, scenario: '', videoEnabled: true, videoQuestion: '', recordingLimit: 60, evaluationFocus: [], retakes: 1 },
      round4: { enabled: false, type: 'Custom Written', instructions: '', passingScore: 70 },
    },
    weights: { r1: 25, r2: 25, r3: 25, r4: 25 },
    passingScore: 60,
    autoShortlist: false, autoShortlistThreshold: 80,
    autoSendResult: true, showScoresImmediately: true,
    candidateSettings: { access: 'open', inviteEmails: '', startDate: '', endDate: '', maxAttempts: 1 },
    antiCheating: { tabSwitch: true, tabSwitchLimit: 3, fullscreen: false, randomizeQuestions: true, randomizeOptions: true },
  });

  const setR = (round, key, val) => setForm(f => ({ ...f, rounds: { ...f.rounds, [round]: { ...f.rounds[round], [key]: val } } }));
  const toggleChip = (round, key, val) => {
    const cur = form.rounds[round][key] || [];
    setR(round, key, cur.includes(val) ? cur.filter(t => t !== val) : [...cur, val]);
  };
  const topics = TOPICS[form.domain] || TOPICS.General;

  const save = async (publish = false) => {
    if (!form.title.trim()) return alert('Please add an assessment title.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        candidateSettings: {
          ...form.candidateSettings,
          inviteEmails: form.candidateSettings.inviteEmails.split(',').map(e => e.trim()).filter(Boolean),
        },
      };
      const { data } = await axios.post('/api/recruiter/assessments', payload);
      if (publish) {
        const { data: pub } = await axios.post(`/api/recruiter/assessments/${data._id}/publish`);
        setPublished(pub);
      } else {
        navigate('/recruiter/assessments');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  // ── Steps ──────────────────────────────────────────────────────────────────
  const Step1 = () => (
    <div className="space-y-4">
      <div><label className={labelCls}>Assessment Title *</label>
        <input className={inputCls} placeholder="e.g. Zepto Backend Engineer Hiring Test"
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
      <div><label className={labelCls}>Target Role</label>
        <input className={inputCls} placeholder="e.g. Backend Engineer, Data Analyst"
          value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Domain</label>
          <select className={inputCls} value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}>
            {DOMAINS.map(d => <option key={d}>{d}</option>)}</select></div>
        <div><label className={labelCls}>Difficulty</label>
          <select className={inputCls} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}</select></div>
      </div>
      <div><label className={labelCls}>Time Limit (minutes)</label>
        <input type="number" className={inputCls} min={10} max={240} value={form.timeLimit}
          onChange={e => setForm(f => ({ ...f, timeLimit: parseInt(e.target.value) || 60 }))} /></div>
      <div><label className={labelCls}>Description</label>
        <textarea className={inputCls + ' resize-none'} rows={3} placeholder="What will candidates be assessed on?"
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div><label className={labelCls}>Tags (comma separated)</label>
        <input className={inputCls} placeholder="React, Node.js, Python, SQL"
          value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} /></div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4">
      <SectionCard title="Round 1 — MCQ" enabled={form.rounds.round1.enabled} onToggle={v => setR('round1', 'enabled', v)}>
        {form.rounds.round1.enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Questions</label>
                <select className={inputCls} value={form.rounds.round1.questionCount} onChange={e => setR('round1', 'questionCount', parseInt(e.target.value))}>
                  {[5,10,15,20].map(n => <option key={n} value={n}>{n} questions</option>)}</select></div>
              <div><label className={labelCls}>Time / Question (sec)</label>
                <input type="number" className={inputCls} value={form.rounds.round1.timePerQuestion}
                  onChange={e => setR('round1', 'timePerQuestion', parseInt(e.target.value) || 60)} /></div>
            </div>
            <div><label className={labelCls}>Topics</label>
              <div className="flex flex-wrap gap-2">{topics.map(t => (
                <Chip key={t} label={t} active={form.rounds.round1.topics.includes(t)} onClick={() => toggleChip('round1', 'topics', t)} />
              ))}</div></div>
            <Toggle value={form.rounds.round1.useQuestionBank} onChange={v => setR('round1', 'useQuestionBank', v)} label="Use eraAI Question Bank" />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Round 2 — Dynamic Written" enabled={form.rounds.round2.enabled} onToggle={v => setR('round2', 'enabled', v)}>
        {form.rounds.round2.enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Questions</label>
                <select className={inputCls} value={form.rounds.round2.questionCount} onChange={e => setR('round2', 'questionCount', parseInt(e.target.value))}>
                  {[2,3,5].map(n => <option key={n} value={n}>{n} questions</option>)}</select></div>
              <div><label className={labelCls}>Type</label>
                <select className={inputCls} value={form.rounds.round2.type} onChange={e => setR('round2', 'type', e.target.value)}>
                  {['Technical','Behavioral','Mixed'].map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            <div><label className={labelCls}>AI Evaluation Criteria</label>
              <div className="flex flex-wrap gap-2">
                {['Technical accuracy','Communication clarity','Depth of thinking','Real-world applicability'].map(c => (
                  <Chip key={c} label={c} active={form.rounds.round2.evaluationCriteria.includes(c)} onClick={() => toggleChip('round2', 'evaluationCriteria', c)} />
                ))}
              </div></div>
            <div><label className={labelCls}>Custom Instructions for AI</label>
              <textarea className={inputCls + ' resize-none'} rows={2} placeholder="Focus on real-world application..."
                value={form.rounds.round2.customInstructions} onChange={e => setR('round2', 'customInstructions', e.target.value)} /></div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Round 3 — Prompt + Video" enabled={form.rounds.round3.enabled} onToggle={v => setR('round3', 'enabled', v)}>
        {form.rounds.round3.enabled && (
          <div className="space-y-3">
            <div><label className={labelCls}>Workplace Scenario</label>
              <textarea className={inputCls + ' resize-none'} rows={2} placeholder="You are a backend engineer..."
                value={form.rounds.round3.scenario} onChange={e => setR('round3', 'scenario', e.target.value)} /></div>
            <Toggle value={form.rounds.round3.videoEnabled} onChange={v => setR('round3', 'videoEnabled', v)} label="Enable Video Question" />
            {form.rounds.round3.videoEnabled && (<>
              <div><label className={labelCls}>Video Question</label>
                <textarea className={inputCls + ' resize-none'} rows={2} placeholder="Describe a time when..."
                  value={form.rounds.round3.videoQuestion} onChange={e => setR('round3', 'videoQuestion', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Recording Limit</label>
                  <select className={inputCls} value={form.rounds.round3.recordingLimit} onChange={e => setR('round3', 'recordingLimit', parseInt(e.target.value))}>
                    {[30,60,90,120].map(n => <option key={n} value={n}>{n}s</option>)}</select></div>
                <div><label className={labelCls}>Retakes</label>
                  <select className={inputCls} value={form.rounds.round3.retakes} onChange={e => setR('round3', 'retakes', parseInt(e.target.value))}>
                    {[0,1,2].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              </div>
            </>)}
            <div><label className={labelCls}>AI Evaluation Focus</label>
              <div className="flex flex-wrap gap-2">
                {['Communication','Technical depth','Confidence','Problem-solving'].map(f => (
                  <Chip key={f} label={f} active={form.rounds.round3.evaluationFocus.includes(f)} onClick={() => toggleChip('round3', 'evaluationFocus', f)} />
                ))}
              </div></div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Round 4 — Advanced (Optional)" enabled={form.rounds.round4.enabled} onToggle={v => setR('round4', 'enabled', v)}>
        {form.rounds.round4.enabled && (
          <div className="space-y-3">
            <div><label className={labelCls}>Round Type</label>
              <select className={inputCls} value={form.rounds.round4.type} onChange={e => setR('round4', 'type', e.target.value)}>
                {['Case Study','Live Coding','Extended Video','Custom Written'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className={labelCls}>Instructions</label>
              <textarea className={inputCls + ' resize-none'} rows={3} placeholder="Problem statement or instructions..."
                value={form.rounds.round4.instructions} onChange={e => setR('round4', 'instructions', e.target.value)} /></div>
            <div><label className={labelCls}>Passing Score: {form.rounds.round4.passingScore}%</label>
              <input type="range" min={0} max={100} className="w-full accent-primary"
                value={form.rounds.round4.passingScore} onChange={e => setR('round4', 'passingScore', parseInt(e.target.value))} /></div>
          </div>
        )}
      </SectionCard>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-5">
      <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
        <label className={labelCls}>Overall Passing Score: <span className="text-primary font-bold">{form.passingScore}%</span></label>
        <input type="range" min={0} max={100} className="w-full accent-primary"
          value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: parseInt(e.target.value) }))} />
      </div>
      <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
        <h3 className="text-slate-900 text-sm font-semibold mb-3">
          Round Weights
          <span className={`ml-2 text-xs font-normal ${Object.values(form.weights).reduce((a,b)=>a+b,0)===100?'text-success':'text-danger'}`}>
            (Total: {Object.values(form.weights).reduce((a,b)=>a+b,0)}%)
          </span>
        </h3>
        {['r1','r2','r3','r4'].map((k,i) => (
          <div key={k} className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">Round {i+1}</span>
              <span className="text-primary font-semibold">{form.weights[k]}%</span>
            </div>
            <input type="range" min={0} max={100} className="w-full accent-primary"
              value={form.weights[k]} onChange={e => setForm(f => ({ ...f, weights: { ...f.weights, [k]: parseInt(e.target.value) } }))} />
          </div>
        ))}
      </div>
      <div className="bg-dark-bg border border-dark-border rounded-xl p-4 space-y-3">
        <Toggle value={form.autoShortlist} onChange={v => setForm(f => ({...f, autoShortlist: v}))} label="Auto-shortlist high scorers" />
        {form.autoShortlist && (
          <div><label className={labelCls}>Auto-shortlist above (%)</label>
            <input type="number" className={inputCls} min={0} max={100} value={form.autoShortlistThreshold}
              onChange={e => setForm(f => ({...f, autoShortlistThreshold: parseInt(e.target.value)||80}))} /></div>
        )}
        <Toggle value={form.autoSendResult} onChange={v => setForm(f=>({...f,autoSendResult:v}))} label="Auto-send results to candidates" />
        <Toggle value={form.showScoresImmediately} onChange={v => setForm(f=>({...f,showScoresImmediately:v}))} label="Show scores immediately after completion" />
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-5">
      <div><label className={labelCls}>Who Can Take This Assessment</label>
        <select className={inputCls} value={form.candidateSettings.access}
          onChange={e => setForm(f=>({...f,candidateSettings:{...f.candidateSettings,access:e.target.value}}))}>
          <option value="open">Open to all eraAI students</option>
          <option value="invite">Invite only</option>
          <option value="domain">Domain restricted</option>
        </select></div>
      {form.candidateSettings.access === 'invite' && (
        <div><label className={labelCls}>Invite Emails (comma separated)</label>
          <textarea className={inputCls+' resize-none'} rows={3} placeholder="john@example.com, jane@example.com"
            value={form.candidateSettings.inviteEmails}
            onChange={e => setForm(f=>({...f,candidateSettings:{...f.candidateSettings,inviteEmails:e.target.value}}))} /></div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Start Date</label>
          <input type="date" className={inputCls} value={form.candidateSettings.startDate}
            onChange={e => setForm(f=>({...f,candidateSettings:{...f.candidateSettings,startDate:e.target.value}}))} /></div>
        <div><label className={labelCls}>End Date</label>
          <input type="date" className={inputCls} value={form.candidateSettings.endDate}
            onChange={e => setForm(f=>({...f,candidateSettings:{...f.candidateSettings,endDate:e.target.value}}))} /></div>
      </div>
      <div><label className={labelCls}>Max Attempts</label>
        <select className={inputCls} value={form.candidateSettings.maxAttempts}
          onChange={e => setForm(f=>({...f,candidateSettings:{...f.candidateSettings,maxAttempts:parseInt(e.target.value)}}))}>
          {[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
      <div className="bg-dark-bg border border-dark-border rounded-xl p-4 space-y-3">
        <p className="text-slate-900 text-sm font-semibold">Anti-Cheating</p>
        <Toggle value={form.antiCheating.tabSwitch} onChange={v=>setForm(f=>({...f,antiCheating:{...f.antiCheating,tabSwitch:v}}))} label="Tab switch detection" />
        <Toggle value={form.antiCheating.fullscreen} onChange={v=>setForm(f=>({...f,antiCheating:{...f.antiCheating,fullscreen:v}}))} label="Require fullscreen" />
        <Toggle value={form.antiCheating.randomizeQuestions} onChange={v=>setForm(f=>({...f,antiCheating:{...f.antiCheating,randomizeQuestions:v}}))} label="Randomize question order" />
        <Toggle value={form.antiCheating.randomizeOptions} onChange={v=>setForm(f=>({...f,antiCheating:{...f.antiCheating,randomizeOptions:v}}))} label="Randomize answer options" />
      </div>
    </div>
  );

  const Step5 = () => published ? (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
        <Check size={28} className="text-success" />
      </div>
      <h3 className="text-slate-900 font-black text-xl mb-2">Assessment Published!</h3>
      <p className="text-text-secondary text-sm mb-4">Share this link with candidates:</p>
      <div className="bg-dark-bg border border-dark-border rounded-xl px-4 py-3 mb-5 text-primary text-sm break-all select-all font-mono">
        {published.shareableLink}
      </div>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
        onClick={() => navigate('/recruiter/assessments')}
        className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-dark-card rounded-xl font-semibold text-sm">
        View All Assessments
      </motion.button>
    </div>
  ) : (
    <div className="space-y-4">
      <h3 className="text-slate-900 font-bold">Assessment Summary</h3>
      <div className="bg-dark-bg border border-dark-border rounded-xl p-4 space-y-2.5 text-sm">
        {[['Title', form.title||'—'],['Domain',form.domain],['Difficulty',form.difficulty],['Time Limit',`${form.timeLimit} min`],
          ['Passing Score',`${form.passingScore}%`],['Access',form.candidateSettings.access],
          ['Rounds Enabled', Object.entries(form.rounds).filter(([,v])=>v.enabled).map(([k])=>k.replace('round','R')).join(', ')]
        ].map(([k,v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-text-secondary">{k}</span>
            <span className="text-slate-900 font-medium capitalize">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          onClick={()=>save(false)} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-dark-border text-text-secondary rounded-xl font-semibold text-sm hover:text-slate-900 disabled:opacity-60 transition-colors">
          <Save size={15}/> Save Draft
        </motion.button>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          onClick={()=>save(true)} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-secondary to-primary text-dark-card rounded-xl font-semibold text-sm disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-dark-card border-t-transparent rounded-full animate-spin"/> : <><Send size={15}/> Publish</>}
        </motion.button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return Step1();
      case 1:
        return Step2();
      case 2:
        return Step3();
      case 3:
        return Step4();
      case 4:
        return Step5();
      default:
        return Step1();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />
      <main className="lg:ml-[325px] pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900">Assessment Builder</h1>
            <p className="text-text-secondary text-sm mt-0.5">Create a custom hiring assessment</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <button onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    i === step ? 'bg-primary/10 text-primary border border-primary/30' :
                    i < step ? 'text-success cursor-pointer' : 'text-text-muted'}`}>
                  {i < step
                    ? <Check size={12}/>
                    : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">{i+1}</span>}
                  {s}
                </button>
                {i < STEPS.length-1 && <div className={`flex-1 h-px min-w-3 ${i<step?'bg-success':'bg-dark-border'}`}/>}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 4 && (
            <div className="flex justify-between">
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                onClick={() => step>0 ? setStep(s=>s-1) : navigate('/recruiter/assessments')}
                className="flex items-center gap-2 px-5 py-2.5 border border-dark-border text-text-secondary rounded-xl text-sm font-semibold hover:text-slate-900 transition-colors">
                <ChevronLeft size={16}/>{step===0?'Cancel':'Back'}
              </motion.button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                onClick={()=>setStep(s=>s+1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
                Next <ChevronRight size={16}/>
              </motion.button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
