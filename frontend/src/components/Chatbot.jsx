import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle, ChevronRight, SkipForward, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CHATBOT_THEME = {
  panel: '#DDEAF6',
  panelBorder: '#A7D7F1',
  headerStart: '#A9DDFC',
  headerEnd: '#C7E9FB',
  headerText: '#1B4F78',
  mutedText: '#7C8CA6',
  bubble: '#F8FBFF',
  bubbleText: '#20557D',
  primaryStart: '#6E5AF6',
  primaryEnd: '#1DA8DE',
  primaryText: '#FFFFFF',
  secondaryText: '#92A0B7',
  accent: '#55A9EA',
  optionBg: '#EEF7FF',
  optionBorder: 'rgba(128,181,221,0.35)',
  success: '#37C871',
  link: '#713BFF',
};

const STEPS = [
  { id: 0, type: 'intro' },
  { id: 1, type: 'text', field: 'name', question: "Awesome! First things first - what's your name?" },
  { id: 2, type: 'text', field: 'college', question: (name) => `Great to meet you, ${name}! Which college are you from?` },
  { id: 3, type: 'options', field: 'year', question: 'Which year are you in?', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'] },
  { id: 4, type: 'options', field: 'tier', question: "What's your college tier?", options: ['Tier 1 - IIT/NIT/BITS', 'Tier 2 - State Universities', 'Tier 3 - Local Colleges'] },
  { id: 5, type: 'password', field: 'password', question: 'Almost there! Set your password:' },
  { id: 6, type: 'email', field: 'email', question: 'Enter your email to save your progress:' },
  { id: 7, type: 'final' },
];

const TIER_MAP = {
  'Tier 1 - IIT/NIT/BITS': 'Tier 1',
  'Tier 2 - State Universities': 'Tier 2',
  'Tier 3 - Local Colleges': 'Tier 3',
};

const initialForm = { name: '', college: '', year: '', tier: '', password: '', email: '' };

const AriaAvatarHeader = () => (
  <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #5B9EFF, #7EC9FF)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 3,
        borderRadius: '50%',
        background: '#152847',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Bot size={18} color="#8ED9FF" />
    </div>
  </div>
);

const AriaAvatarTiny = () => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: '50%',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #5E9FFF, #7DC0FF)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Bot size={14} color="#fff" />
  </div>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const autoOpenedRef = useRef(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const getPostSignupRoute = () => {
    const preferredDomain = sessionStorage.getItem('ciq_preselected_domain');
    return preferredDomain ? `/select-subdomain/${preferredDomain}` : '/select-domain';
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    if (autoOpenedRef.current) return;
    const timer = setTimeout(() => {
      autoOpenedRef.current = true;
      setOpen(true);
      setShowPreview(false);
    }, 5000);
    const previewTimer = setTimeout(() => setShowPreview(true), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(previewTimer);
    };
  }, []);

  const initChatbot = useCallback(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        time: new Date(),
        text: "Hey! I'm Aria, your eraAI guide!\nI'll get you set up in under 2 minutes.\nReady to prove your AI skills to the world?",
        type: 'intro',
      },
    ]);
    setStep(0);
    setError('');
    setInputValue('');
    setFormData(initialForm);
    setSubmitted(false);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      const timer = setTimeout(initChatbot, 250);
      return () => clearTimeout(timer);
    }
    if (!open) {
      const timer = setTimeout(() => setShowPreview(true), 4000);
      return () => clearTimeout(timer);
    }
    setShowPreview(false);
    return undefined;
  }, [open, messages.length, initChatbot]);

  useEffect(() => {
    const handler = (event) => {
      const preferredDomain = event?.detail?.preferredDomain;
      if (preferredDomain) {
        sessionStorage.setItem('ciq_preselected_domain', preferredDomain);
      }
      setOpen(true);
      autoOpenedRef.current = true;
    };

    window.addEventListener('openChatbot', handler);
    return () => window.removeEventListener('openChatbot', handler);
  }, []);

  const showTyping = async (duration = 700) => {
    setTyping(true);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setTyping(false);
  };

  const proceedToStep = async (nextStep, userMessage = null) => {
    if (userMessage) {
      setMessages((prev) => [...prev, { id: Date.now(), text: userMessage, sender: 'user', time: new Date() }]);
    }

    await showTyping();

    const currentStep = STEPS.find((item) => item.id === nextStep);
    if (!currentStep) return;

    const text = typeof currentStep.question === 'function' ? currentStep.question(formData.name) : currentStep.question;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text,
        sender: 'bot',
        time: new Date(),
        stepId: nextStep,
        type: currentStep.type,
        options: currentStep.options,
      },
    ]);
    setStep(nextStep);
    setInputValue('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) initChatbot();
  };

  const handleOptionSelect = async (option) => {
    const currentStepData = STEPS.find((item) => item.id === step);
    if (!currentStepData) return;

    const nextData = { ...formData };
    nextData[currentStepData.field] = currentStepData.field === 'tier' ? TIER_MAP[option] || option : option;
    setFormData(nextData);
    setError('');

    if (step < 6) {
      await proceedToStep(step + 1, option);
    }
  };

  const handleSubmit = async (data) => {
    if (!data.email || !data.password) {
      setError('Email and password are required to create your account');
      return;
    }

    setLoading(true);
    try {
      await showTyping(1000);
      await register({
        name: data.name || 'Student',
        email: data.email,
        password: data.password,
        college: data.college,
        year: data.year,
        tier: data.tier,
      });

      setSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `You're all set, ${data.name || 'Student'}!\nNext, choose your domain and specialization so we can tailor every round to you.`,
          sender: 'bot',
          time: new Date(),
          type: 'final',
        },
      ]);
      setStep(7);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      setMessages((prev) => [...prev, { id: Date.now(), text: `Oops! ${msg}`, sender: 'bot', time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const currentStepData = STEPS.find((item) => item.id === step);
    if (!currentStepData) return;

    if (!inputValue.trim()) {
      setError('Please fill this in before continuing');
      return;
    }

    if (currentStepData.type === 'email' && !/\S+@\S+\.\S+/.test(inputValue)) {
      setError('Please enter a valid email');
      return;
    }

    if (currentStepData.type === 'password' && inputValue.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const nextData = { ...formData, [currentStepData.field]: inputValue.trim() };
    setFormData(nextData);
    const displayValue = currentStepData.type === 'password' ? '••••••••' : inputValue.trim();

    if (step < 6) {
      await proceedToStep(step + 1, displayValue);
    } else {
      setMessages((prev) => [...prev, { id: Date.now(), text: displayValue, sender: 'user', time: new Date() }]);
      setInputValue('');
      await handleSubmit(nextData);
    }
  };

  const handleSkip = async () => {
    if (step === 0) {
      setOpen(false);
      return;
    }

    if (step < 6) {
      await proceedToStep(step + 1, 'Skipped');
    }
  };

  const handleContinue = () => {
    setOpen(false);
    navigate(getPostSignupRoute());
  };

  const currentStepData = STEPS.find((item) => item.id === step);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}
          >
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.92 }}
                  onClick={handleOpen}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${CHATBOT_THEME.panelBorder}`,
                    borderRadius: '16px 16px 4px 16px',
                    padding: '10px 14px',
                    maxWidth: 230,
                    cursor: 'pointer',
                    boxShadow: '0 16px 40px rgba(37,99,235,0.12)',
                  }}
                >
                  <p style={{ color: CHATBOT_THEME.bubbleText, fontSize: 13, fontWeight: 600, margin: 0 }}>
                    Ready to build your domain-specific assessment?
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: CHATBOT_THEME.success }} className="animate-pulse" />
                    <span style={{ fontSize: 11, color: CHATBOT_THEME.mutedText }}>Aria is online</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${CHATBOT_THEME.primaryStart}, ${CHATBOT_THEME.primaryEnd})`,
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 18px 36px rgba(37,99,235,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={24} color="#fff" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 50,
              width: 380,
              height: 520,
              maxHeight: 'calc(100vh - 48px)',
              display: 'flex',
              flexDirection: 'column',
              background: CHATBOT_THEME.panel,
              border: `1px solid ${CHATBOT_THEME.panelBorder}`,
              borderRadius: 24,
              boxShadow: '0 24px 60px rgba(100,146,185,0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 14px',
                background: `linear-gradient(135deg, ${CHATBOT_THEME.headerStart}, ${CHATBOT_THEME.headerEnd})`,
                borderBottom: `1px solid ${CHATBOT_THEME.panelBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AriaAvatarHeader />
                <div>
                  <p style={{ color: CHATBOT_THEME.headerText, fontWeight: 700, fontSize: 14, margin: 0 }}>Aria</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: CHATBOT_THEME.success }} className="animate-pulse" />
                    <span style={{ fontSize: 11, color: '#1770AE' }}>eraAI Guide</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(171, 222, 250, 0.55)',
                  border: '1px solid rgba(124, 196, 236, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#1B6FA7',
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: 7, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}
                >
                  {msg.sender === 'bot' && <AriaAvatarTiny />}
                  <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 5, alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={{
                        padding: '11px 14px',
                        fontSize: 13,
                        lineHeight: 1.55,
                        whiteSpace: 'pre-line',
                        color: msg.sender === 'bot' ? CHATBOT_THEME.bubbleText : '#fff',
                        borderRadius: msg.sender === 'bot' ? '0 18px 18px 18px' : '18px 18px 4px 18px',
                        background: msg.sender === 'bot' ? CHATBOT_THEME.bubble : `linear-gradient(135deg, ${CHATBOT_THEME.primaryStart}, ${CHATBOT_THEME.primaryEnd})`,
                        border: msg.sender === 'bot' ? '1px solid rgba(186, 217, 237, 0.6)' : 'none',
                        boxShadow: msg.sender === 'bot' ? 'none' : 'none',
                      }}
                    >
                      {msg.text}
                    </div>

                    {msg.type === 'options' && msg.options && step === msg.stepId && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {msg.options.map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleOptionSelect(option)}
                            style={{
                              padding: '6px 11px',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: CHATBOT_THEME.optionBg,
                              border: `1px solid ${CHATBOT_THEME.optionBorder}`,
                              borderRadius: 10,
                              color: CHATBOT_THEME.headerText,
                            }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {msg.type === 'final' && submitted && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleContinue}
                        style={{
                          marginTop: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          padding: '9px 16px',
                          background: `linear-gradient(135deg, ${CHATBOT_THEME.primaryStart}, ${CHATBOT_THEME.primaryEnd})`,
                          border: 'none',
                          borderRadius: 11,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Sparkles size={13} />
                        Choose My Domain
                      </motion.button>
                    )}

                    {msg.type === 'intro' && step === 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => proceedToStep(1)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '10px 16px',
                              fontSize: 12,
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${CHATBOT_THEME.primaryStart}, ${CHATBOT_THEME.primaryEnd})`,
                              border: 'none',
                              borderRadius: 12,
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={12} /> Let's Go!
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setOpen(false)}
                            style={{
                              padding: '10px 0',
                              fontSize: 12,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 9,
                              color: CHATBOT_THEME.secondaryText,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Maybe Later
                          </motion.button>
                        </div>
                        <p style={{ margin: 0, fontSize: 12, color: '#667A93' }}>
                          Already have an account?{' '}
                          <button
                            onClick={() => navigate('/login')}
                            style={{
                              padding: 0,
                              border: 'none',
                              background: 'transparent',
                              color: CHATBOT_THEME.link,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Sign in here
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <AriaAvatarTiny />
                    <div
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        gap: 4,
                        background: CHATBOT_THEME.bubble,
                        border: '1px solid rgba(186, 217, 237, 0.6)',
                        borderRadius: '0 18px 18px 18px',
                      }}
                    >
                      {[0, 1, 2].map((index) => (
                        <motion.div
                          key={index}
                          style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity, delay: index * 0.12 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {step > 0 && step < 7 && !submitted && currentStepData?.type !== 'options' && (
              <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(37,99,235,0.1)', flexShrink: 0 }}>
                {error && <p style={{ fontSize: 11, color: '#DC2626', marginBottom: 6, paddingLeft: 2 }}>{error}</p>}
                <div style={{ display: 'flex', gap: 7 }}>
                  <input
                    ref={inputRef}
                    type={currentStepData?.type === 'password' ? 'password' : currentStepData?.type === 'email' ? 'email' : 'text'}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNext();
                    }}
                    placeholder={currentStepData?.type === 'password' ? 'Enter password...' : currentStepData?.type === 'email' ? 'you@example.com' : 'Type your answer...'}
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: 11,
                      padding: '8px 12px',
                      fontSize: 13,
                      color: CHATBOT_THEME.headerText,
                      outline: 'none',
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handleNext}
                    disabled={loading}
                    style={{
                      padding: '8px 12px',
                      background: `linear-gradient(135deg, ${CHATBOT_THEME.primaryStart}, ${CHATBOT_THEME.primaryEnd})`,
                      border: 'none',
                      borderRadius: 11,
                      color: '#fff',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? (
                      <div style={{ width: 15, height: 15, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    ) : (
                      <ChevronRight size={17} />
                    )}
                  </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {STEPS.filter((item) => item.id > 0 && item.id < 7).map((item) => (
                      <div key={item.id} style={{ height: 3, width: 18, borderRadius: 3, background: item.id <= step ? CHATBOT_THEME.accent : '#E2E8F0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <button onClick={handleSkip} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: CHATBOT_THEME.mutedText, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <SkipForward size={10} /> Skip
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
