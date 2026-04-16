import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, CheckCircle, ChevronDown, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config/env';

const GOOGLE_CONFIGURED = GOOGLE_CLIENT_ID &&
  GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

function PasswordStrength({ password }) {
  const score = useMemo(() => {
    let nextScore = 0;
    if (password.length >= 8) nextScore += 1;
    if (/[A-Z]/.test(password)) nextScore += 1;
    if (/\d/.test(password)) nextScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) nextScore += 1;
    return nextScore;
  }, [password]);

  if (!password) return null;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-danger', 'bg-warning', 'bg-primary', 'bg-success'];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={`h-1 flex-1 rounded-full ${index <= score ? colors[score] : 'bg-dark-border'}`} />
        ))}
      </div>
      <p className={`text-xs mt-0.5 ${score <= 1 ? 'text-danger' : score === 2 ? 'text-warning' : score === 3 ? 'text-primary' : 'text-success'}`}>
        {labels[score]}
      </p>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon, error, rightElement }) {
  return (
    <div>
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>
      <div className="relative mt-1">
        {Icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={15} />
          </div>
        ) : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-dark-bg border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${Icon ? 'pl-9' : ''} ${rightElement ? 'pr-10' : ''} ${error ? 'border-danger/60 focus:border-danger' : 'border-dark-border focus:border-primary/60'}`}
        />
        {rightElement ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div> : null}
      </div>
      {error ? (
        <p className="flex items-center gap-1 text-xs text-danger mt-1">
          <AlertCircle size={11} /> {error}
        </p>
      ) : null}
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', college: '', year: '' });
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const getPostAuthRoute = (account) => {
    const preferredDomain = sessionStorage.getItem('ciq_preselected_domain');
    if (!(account?.subdomain || account?.stream)) {
      return preferredDomain ? `/select-subdomain/${preferredDomain}` : '/select-domain';
    }
    return '/dashboard';
  };

  if (!isOpen) return null;

  const setLoginField = (field) => (event) => {
    setLoginData((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const setSignupField = (field) => (event) => {
    setSignupData((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const validateLogin = () => {
    const nextErrors = {};
    if (!loginData.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) nextErrors.email = 'Invalid email address';
    if (!loginData.password) nextErrors.password = 'Password is required';
    return nextErrors;
  };

  const validateSignup = () => {
    const nextErrors = {};
    if (!signupData.name.trim()) nextErrors.name = 'Name is required';
    if (!signupData.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) nextErrors.email = 'Invalid email address';
    if (!signupData.password) nextErrors.password = 'Password is required';
    else if (signupData.password.length < 8) nextErrors.password = 'Must be at least 8 characters';
    else if (!/[A-Z]/.test(signupData.password)) nextErrors.password = 'Must include an uppercase letter';
    else if (!/\d/.test(signupData.password)) nextErrors.password = 'Must include a number';
    return nextErrors;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const account = await login(loginData.email, loginData.password);
      onClose();
      navigate(getPostAuthRoute(account));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const nextErrors = validateSignup();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const account = await register({
        name: signupData.name.trim(),
        email: signupData.email,
        password: signupData.password,
        college: signupData.college.trim(),
        year: signupData.year,
      });
      onClose();
      navigate(getPostAuthRoute(account));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setApiError('');
    try {
      const account = await googleLogin(credentialResponse.credential);
      onClose();
      navigate(getPostAuthRoute(account));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eyeButton = (
    <button type="button" onClick={() => setShowPass((prev) => !prev)} className="text-text-muted hover:text-text-secondary transition-colors">
      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-xl shadow-2xl overflow-y-auto"
          style={{ maxHeight: '90vh' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h2 className="text-xl font-black text-white">{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {tab === 'login' ? 'Sign in to continue your assessment' : 'Your domain and specialization come next'}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="px-6">
            <div className="flex bg-dark-bg rounded-xl p-1 gap-1">
              {['login', 'signup'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setTab(item);
                    setErrors({});
                    setApiError('');
                  }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === item ? 'bg-dark-card text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                >
                  {item === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 space-y-3">
            {apiError ? (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2.5 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
                <AlertCircle size={14} className="shrink-0" />
                {apiError}
              </motion.div>
            ) : null}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <InputField label="Email" type="email" value={loginData.email} onChange={setLoginField('email')} placeholder="your@email.com" icon={Mail} error={errors.email} />
                <InputField label="Password" type={showPass ? 'text' : 'password'} value={loginData.password} onChange={setLoginField('password')} placeholder="Enter password" icon={Lock} error={errors.password} rightElement={eyeButton} />
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-sm btn-glow transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={15} />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <InputField label="Full Name" value={signupData.name} onChange={setSignupField('name')} placeholder="Your name" icon={User} error={errors.name} />
                <InputField label="College Name" value={signupData.college} onChange={setSignupField('college')} placeholder="Your college / university" icon={User} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField label="Email" type="email" value={signupData.email} onChange={setSignupField('email')} placeholder="your@email.com" icon={Mail} error={errors.email} />
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Year</label>
                    <div className="relative mt-1">
                      <select
                        value={signupData.year}
                        onChange={setSignupField('year')}
                        className={`w-full appearance-none bg-dark-bg border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors pr-10 ${signupData.year ? 'text-white' : 'text-text-muted'} border-dark-border focus:border-primary/60`}
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <InputField label="Password" type={showPass ? 'text' : 'password'} value={signupData.password} onChange={setSignupField('password')} placeholder="Min 8 chars, 1 uppercase, 1 number" icon={Lock} error={errors.password} rightElement={eyeButton} />
                  <PasswordStrength password={signupData.password} />
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-text-secondary">
                  After signup, you'll choose your domain and subdomain on the next screen.
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-sm btn-glow transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={15} />}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-xs text-text-muted">or continue with</span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>

            {GOOGLE_CONFIGURED ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setApiError('Google sign-in failed. Please try again.')}
                  text={tab === 'login' ? 'signin_with' : 'signup_with'}
                  shape="rectangular"
                  size="large"
                  width="368"
                  theme="outline"
                />
              </div>
            ) : (
              <button disabled className="w-full flex items-center justify-center gap-3 py-2.5 border border-dark-border rounded-xl text-text-muted text-sm cursor-not-allowed bg-dark-bg">
                Continue with Google
              </button>
            )}

            <p className="text-center text-xs text-text-muted">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-primary hover:underline font-medium">
                {tab === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
