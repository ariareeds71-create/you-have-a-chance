import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/WorkspaceDashboard.jsx';
import { authConfigured, supabase } from './lib/supabase.js';
import './styles/cinematic.css';
import './styles/profile.css';
import './styles/profile-optional.css';

const people = [
  ['BUILDER', 'I have something I want to build.', '01'],
  ['MENTOR', 'I know something that can help.', '02'],
  ['COLLABORATOR', 'I want to build with others.', '03'],
  ['SUPPORTER', 'I want to help promising people and projects.', '04'],
];

const journey = ['IDEA', 'LEARN', 'BUILD', 'CONNECT', 'OPPORTUNITY', 'SUPPORT', 'LAUNCH', 'LEARN AGAIN'];
const talent = [
  ['MAYA / BUILDER', 'Designing a tool for first-generation founders.', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85'],
  ['DAVID / CREATIVE', 'Turning a local story into a short film.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85'],
  ['AMARA / MENTOR', 'Helping people find a confident first step.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85'],
];

function Reveal({ children, className = '' }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function Onboarding({ onClose, onAuthenticated, onExplore, authenticated, initialError = '' }) {
  const [choice, setChoice] = useState('');
  const [accessMode, setAccessMode] = useState('signup');
  const [providerMessage, setProviderMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [details, setDetails] = useState({ name: '', email: '', password: '' });
  const [step, setStep] = useState('role');
  const [authError, setAuthError] = useState('');
  const [busy, setBusy] = useState(false);
  const options = [
    ['I\'M BUILDING SOMETHING', 'I have an idea or project.'],
    ['I WANT TO MENTOR', 'I have knowledge or experience to share.'],
    ['I WANT TO COLLABORATE', 'I want to build with other people.'],
    ['I WANT TO SUPPORT', 'I want to support people and projects.'],
    ['I\'M EXPLORING', 'I do not know exactly what I am looking for yet.'],
  ];
  const redirectTo = `${window.location.origin}/`;
  const startOAuth = async (provider) => {
    if (!authConfigured) {
      setAuthError('Authentication is not configured yet. Add the Supabase environment variables first.');
      return;
    }
    setBusy(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) setAuthError(error.message);
    setBusy(false);
  };
  const submitEmail = async () => {
    if (!authConfigured) {
      setAuthError('Authentication is not configured yet. Add the Supabase environment variables first.');
      return;
    }
    setBusy(true);
    setAuthError('');
    const result = accessMode === 'signup'
      ? await supabase.auth.signUp({ email: details.email, password: details.password, options: { data: { full_name: details.name, role: choice } } })
      : await supabase.auth.signInWithPassword({ email: details.email, password: details.password });
    if (result.error) setAuthError(result.error.message);
    else if (result.data.session) onAuthenticated(choice);
    else setAuthError('Check your email to confirm your account, then return to log in.');
    setBusy(false);
  };
  const continueFromRole = async () => {
    if (choice === 'I\'M EXPLORING') {
      onExplore();
      return;
    }
    if (authenticated) {
      onAuthenticated(choice);
      return;
    }
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onAuthenticated(choice);
        return;
      }
    }
    setStep('access');
  };
  if (step === 'access') return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="access-title">
      <button className="onboarding__close" onClick={onClose} aria-label="Close account access">×</button>
      <div className="onboarding__panel auth-panel">
        <p className="kicker">C.A.N. / {accessMode === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</p>
        <h2 id="access-title">{accessMode === 'signup' ? <>MAKE YOUR<br /><em>FIRST MOVE.</em></> : <>WELCOME<br /><em>BACK.</em></>}</h2>
        <div className="auth-toggle"><button className={accessMode === 'signup' ? 'active' : ''} onClick={() => setAccessMode('signup')}>CREATE ACCOUNT</button><button className={accessMode === 'login' ? 'active' : ''} onClick={() => setAccessMode('login')}>LOG IN</button></div>
        <div className="provider-grid provider-grid--single"><button disabled={busy} onClick={() => startOAuth('google')}>G <span>CONTINUE WITH GOOGLE</span></button></div>
        {(providerMessage || authError) && <p className="auth-message">{authError || providerMessage}</p>}
        <div className="auth-divider"><span>OR USE EMAIL</span></div>
        {accessMode === 'signup' && <label>YOUR NAME<input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} autoComplete="name" /></label>}
        <label>EMAIL ADDRESS<input type="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} autoComplete="email" /></label>
        <label>PASSWORD<input type="password" value={details.password} onChange={(event) => setDetails({ ...details, password: event.target.value })} autoComplete={accessMode === 'signup' ? 'new-password' : 'current-password'} /></label>
        {accessMode === 'signup' && <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>. I understand my data is protected by default and I control what I share.</span></label>}
        <button className="button button--light onboarding__continue" disabled={busy || !details.email || !details.password || (accessMode === 'signup' && (!details.name || !consent))} onClick={submitEmail}>{busy ? 'CONNECTING...' : accessMode === 'signup' ? 'CREATE ACCOUNT' : 'LOG IN'} <span>↗</span></button>
        <p className="onboarding__note">Your session is managed by Supabase Auth. Identity verification is required before participation.</p>
      </div>
    </div>
  );
  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <button className="onboarding__close" onClick={onClose} aria-label="Close onboarding">×</button>
      <div className="onboarding__panel">
        <p className="kicker">C.A.N. / {authenticated ? 'SIGNED IN' : 'FIRST STEP'}</p>
        <h2 id="onboarding-title">WHAT ARE YOU<br /><em>HERE TO DO?</em></h2>
        {authenticated && <p className="onboarding__signed-in">Your Google session is active. Choose a role to enter your C.A.N. dashboard.</p>}
        <div className="onboarding__options">
          {options.map(([title, text]) => (
            <button key={title} className={`choice ${choice === title ? 'choice--selected' : ''}`} onClick={() => setChoice(title)}>
              <span><strong>{title}</strong><small>{text}</small></span><i>{choice === title ? '✓' : '↗'}</i>
            </button>
          ))}
        </div>
        <button className="button button--light onboarding__continue" disabled={!choice} onClick={continueFromRole}>{choice === 'I\'M EXPLORING' ? 'ENTER EXPLORE MODE' : authenticated ? 'ENTER MY C.A.N. SPACE' : 'CONTINUE TO ACCOUNT'} <span>↗</span></button>
        {(initialError || authError) && <p className="auth-message">{initialError || authError}</p>}
        <p className="onboarding__note">Exploring is open without an account. Participation features require protected access.</p>
      </div>
    </div>
  );
}

function StartButton({ onStart, children = 'START BUILDING' }) {
  return <button className="button button--light" onClick={onStart}>{children} <span>↗</span></button>;
}

function ProfileSetup({ role, onComplete }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const usernameValid = /^[a-z0-9_]{3,30}$/.test(username);
  const selectAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      setError('Use a JPG, PNG, or WebP image under 3 MB.');
      return;
    }
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };
  const saveProfile = async () => {
    if (!usernameValid || !name.trim()) return;
    setBusy(true);
    setError('');
    if (supabase) {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      let avatarUrl = null;
      if (avatar && userId) {
        const path = `${userId}/avatar-${Date.now()}.${avatar.name.split('.').pop()}`;
        const upload = await supabase.storage.from('profile-avatars').upload(path, avatar, { upsert: true, contentType: avatar.type });
        if (upload.error) { setError(upload.error.message); setBusy(false); return; }
        avatarUrl = supabase.storage.from('profile-avatars').getPublicUrl(path).data.publicUrl;
      }
      const update = await supabase.from('profiles').update({ username, display_name: name.trim(), bio: bio.trim(), ...(avatarUrl ? { avatar_url: avatarUrl } : {}) }).eq('id', userId);
      if (update.error) { setError(update.error.message.includes('duplicate') ? 'That username is already taken.' : update.error.message); setBusy(false); return; }
    }
    setBusy(false);
    onComplete({ role, username, name: name.trim(), bio, preview });
  };
  return <div className="profile-setup" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div className="profile-setup__panel"><p className="kicker">C.A.N. / YOUR PROFILE</p><h2 id="profile-title">WELCOME<br /><em>INSIDE.</em></h2><p className="profile-setup__lede">Browse your new space now. Create a username, picture, and bio whenever you are ready to be seen and participate.</p><label className="avatar-picker"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectAvatar} /><span className="avatar-preview">{preview ? <img src={preview} alt="Profile preview" /> : '＋'}</span><span><strong>ADD PROFILE PICTURE</strong><small>Optional · JPG, PNG or WebP</small></span></label><label className="profile-field">USERNAME<input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="your_username" maxLength={30} /><small>3–30 lowercase letters, numbers, or underscores</small></label><label className="profile-field">FULL NAME<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label><label className="profile-field">BIO <span>{bio.length}/500</span><textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="What are you building, learning, or here to help with?" maxLength={500} /></label>{error && <p className="profile-error">{error}</p>}<button className="button button--light" disabled={busy || !usernameValid || !name.trim()} onClick={saveProfile}>{busy ? 'SAVING...' : 'SAVE PROFILE & ENTER SPACE'} <span>↗</span></button><button className="profile-skip" onClick={() => onComplete(null)}>ENTER SPACE FOR NOW / SET UP PROFILE LATER</button><p className="profile-setup__note">Verification is a separate private trust step. You can browse before completing your profile.</p></div></div>;
}

function Globe() {
  return <div className="world-globe" role="img" aria-label="Photographic globe showing a connected world"><div className="world-globe__shine" /><div className="world-globe__pin world-globe__pin--africa">AFRICA</div><div className="world-globe__pin world-globe__pin--europe" /><div className="world-globe__pin world-globe__pin--asia" /><div className="world-globe__pin world-globe__pin--americas" /></div>;
}

function ExploreSpace({ onClose, onStart }) {
  return <div className="explore-space" role="dialog" aria-modal="true" aria-label="C.A.N. explore space">
    <header className="explore-space__top"><a href="#top" className="dashboard__logo">C.A.N.</a><span className="explore-space__mode">EXPLORE MODE / NO ACCOUNT REQUIRED</span><button onClick={onClose}>EXIT EXPLORE</button></header>
    <main className="explore-space__main"><div className="explore-space__intro"><p className="kicker">WELCOME TO THE INSIDE / BROWSE FREELY</p><h1>SEE WHAT<br /><em>COULD BE.</em></h1><p>Browse ideas, people, learning paths and future opportunities without creating an account. An account is only needed when you want to post, message, save or ask for help.</p></div><div className="explore-space__globe"><Globe /><span>GLOBAL BY DEFAULT</span></div>
      <section className="explore-space__talent"><div className="explore-space__section-head"><div><p className="kicker">PEOPLE WITH SOMETHING TO SAY / BUILD / MAKE</p><h2>TALENT IS<br /><em>EVERYWHERE.</em></h2></div><span>01 / 03</span></div><div className="talent-grid">{talent.map(([name, text, image]) => <article key={name}><img src={image} alt={name} loading="lazy" /><div><small>{name}</small><p>{text}</p><button onClick={onStart}>VIEW PATH ↗</button></div></article>)}</div></section>
      <section className="explore-space__ai"><div><p className="kicker">C.A.N. GUIDE / AI CONCEPT</p><h2>DON'T KNOW<br /><em>WHERE TO START?</em></h2><p>Ask the C.A.N. guide to help you make sense of a goal, a project or a possible next step. This preview gives direction without making decisions for you.</p></div><AIAssistant /></section>
      <div className="explore-space__gate"><p className="kicker">READY TO PARTICIPATE?</p><h2>READ FIRST.<br /><em>BUILD WHEN READY.</em></h2><p>Browsing is open. Creating posts, asking the community for help and saving a path require a protected account.</p><StartButton onStart={onStart} /></div>
    </main>
  </div>;
}

function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const ask = () => { if (!question.trim()) return; setAnswer('A useful next step could be to name the smallest version of your idea, then find one person who can challenge or strengthen it. You can refine this path when the C.A.N. guide is connected to your account.'); };
  return <div className="ai-assistant"><div className="ai-assistant__head"><span>✦</span><strong>C.A.N. GUIDE</strong><small>PREVIEW</small></div><p className="ai-assistant__prompt">What are you trying to make possible?</p><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="I have an idea about..." aria-label="Ask the C.A.N. guide" /><button onClick={ask} disabled={!question.trim()}>ASK THE GUIDE <span>↗</span></button>{answer && <p className="ai-assistant__answer">{answer}</p>}<small className="ai-assistant__privacy">Do not share passwords, identity documents or financial information.</small></div>;
}

export default function App() {
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState('I\'M BUILDING SOMETHING');
  const [callbackError, setCallbackError] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get('error_description');
    if (errorDescription) {
      setCallbackError(`Google sign-in could not finish: ${errorDescription}. Check the Google Client Secret in Supabase Auth > Providers > Google.`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  useEffect(() => {
    document.body.style.overflow = onboardingOpen || dashboardOpen || exploreOpen || profileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [onboardingOpen, dashboardOpen, exploreOpen, profileOpen]);
  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    const restoreSession = async () => {
      let session;
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        session = result.data.session;
        if (!session) {
          const existing = await supabase.auth.getSession();
          session = existing.data.session;
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const result = await supabase.auth.getSession();
        session = result.data.session;
      }
      if (active && session) {
        setAuthenticated(true);
        setOnboardingOpen(true);
      }
    };
    restoreSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthenticated(true);
        setDashboardOpen(false);
        setOnboardingOpen(true);
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);
  const enterDashboard = async (role) => {
    setSelectedRole(role);
    setAuthenticated(true);
    if (supabase) {
      await supabase.from('profiles').update({ role: role.toLowerCase().replace('i\'m building something', 'builder').replace('i want to mentor', 'mentor').replace('i want to collaborate', 'collaborator').replace('i want to support', 'supporter').replace('i\'m exploring', 'explorer') }).eq('id', (await supabase.auth.getUser()).data.user?.id);
    }
    setOnboardingOpen(false);
    setProfileOpen(true);
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) observer.unobserve(entry.target);
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar onStart={() => setOnboardingOpen(true)} onExplore={() => setExploreOpen(true)} />
      <main id="main">
        <section id="top" className="hero-cinematic">
          <div className="hero-cinematic__image" />
          <div className="hero-cinematic__veil" />
          <div className="hero-cinematic__content container-wide">
            <p className="kicker">CHARMAINE ANNA NCUBE / FOUNDER</p>
            <h1>C.A.<em>N.</em></h1>
            <div className="hero-cinematic__statement"><p>I KNOW WHAT IT'S LIKE TO WANT SOMETHING—<br />AND NOT KNOW HOW TO GET THERE.</p><span>01 / 09</span></div>
            <p className="hero-cinematic__lede">I've had the ambition. The goals. The ideas. I've tried. I've failed. And I've learned that having ambition isn't always the problem. Sometimes, access is.</p>
            <div className="actions"><StartButton onStart={() => setOnboardingOpen(true)} /><a className="text-link" href="#question">DISCOVER C.A.N. <span>↓</span></a></div>
          </div>
          <div className="hero-cinematic__scroll">SCROLL TO ENTER <span>↓</span></div>
        </section>

        <section id="question" className="question section-dark"><Reveal><p className="kicker">THE QUESTION / 01</p><h2>WHAT IF YOUR FUTURE<br /><em>WASN'T LIMITED BY</em><br />WHERE YOU WERE BORN,<br />HOW MUCH YOU HAVE,<br />OR WHO YOU KNOW?</h2></Reveal></section>

        <section className="problem section-cream"><div className="container-wide split"><Reveal><p className="kicker">THE GAP / 02</p><h2>AMBITION<br /><em>IS EVERYWHERE.</em></h2><h3>ACCESS ISN'T.</h3></Reveal><Reveal className="problem__copy"><p>Today, turning an idea into something real can mean navigating dozens of platforms, learning everything from scratch, finding the right people and discovering that some doors aren't even available to you.</p><div className="fragment-list">{['SEARCH', 'LEARN', 'FUND', 'CONNECT', 'BUILD', 'REGISTER', 'LAUNCH'].map((x, i) => <span key={x} style={{ '--i': i }}>{x}</span>)}</div></Reveal></div></section>

        <section id="founder" className="founder section-dark"><div className="container-wide founder__grid"><div className="founder__portrait"><img src="/founder.jpg" alt="Charmaine Anna Ncube, founder of C.A.N." /></div><Reveal className="founder__copy"><p className="kicker">THE FOUNDER / 03</p><h2>CHARMAINE<br /><em>ANNA NCUBE</em></h2><p className="founder__title">FOUNDER, C.A.N.</p><div className="long-copy"><p>My name is Charmaine Anna Ncube.</p><p>I know what it feels like to have ambition, a goal and a dream—but not always know how to turn that ambition into something real.</p><p>I've experienced the frustration of wanting to build while still trying to figure out how. Eventually I realized: the problem isn't always a lack of ambition. Sometimes people simply don't have access to the path between ambition and action.</p><p>That's why I'm building C.A.N. The place I wish existed when I was trying to figure things out.</p></div></Reveal></div></section>

        <section className="door"><div className="door__light" /><div className="door__copy"><p className="kicker">THE DOOR / 04</p><h2>SOMETIMES<br />THE DOOR<br />SIMPLY<br /><em>DOESN'T EXIST.</em></h2><h3>SO CREATE ONE.</h3></div></section>

        <section id="about" className="brand section-cream"><Reveal><p className="kicker">THE BELIEF / 05</p><h2>C.A.<em>N.</em></h2><div className="brand__words"><span>C.A.N.</span><span>CAN.</span><strong>YOU CAN.</strong></div><p>C.A.N. is built around a simple belief: you don't need to have everything figured out before you begin. You need somewhere to start.</p></Reveal></section>

        <section className="ecosystem section-dark"><div className="container-wide"><Reveal><p className="kicker">THE ECOSYSTEM / 06</p><h2>NOT ANOTHER PLACE<br /><em>TO SEARCH.</em></h2><p className="lead">A place to start. A global ecosystem for people who want to turn ideas, ambition and goals into action.</p></Reveal><div className="ecosystem__words">{['BUILD', 'LEARN', 'CONNECT', 'DISCOVER', 'ESTABLISH', 'SUPPORT', 'LAUNCH'].map((x, i) => <span key={x} style={{ '--i': i }}>{x}</span>)}</div></div></section>

        <section id="journey" className="journey section-cream"><div className="container-wide"><Reveal><p className="kicker">THE JOURNEY / 07</p><h2>FROM “I HAVE AN IDEA”<br /><em>TO “I'M BUILDING IT.”</em></h2></Reveal><div className="journey__track">{journey.map((item, i) => <div className="journey__item" key={item}><span>0{i + 1}</span><strong>{item}</strong>{i < journey.length - 1 && <i>→</i>}</div>)}</div></div></section>

        <section id="builders" className="builder section-dark"><div className="container-wide split"><Reveal><p className="kicker">FOR BUILDERS / 08</p><h2>START WITH<br /><em>WHAT YOU HAVE.</em></h2></Reveal><Reveal className="builder__copy"><p>You might have an idea. You might have a goal. You might have a problem you want to solve. You might not have a company, investors or even a first step.</p><p>That's okay. C.A.N. is designed to help you figure out what comes next.</p><StartButton onStart={() => setOnboardingOpen(true)} /></Reveal></div></section>

        <section className="people section-cream"><div className="container-wide"><Reveal><p className="kicker">THE PEOPLE / 09</p><h2>EVERY BEGINNING<br /><em>NEEDS PEOPLE.</em></h2></Reveal><div className="people__grid">{people.map(([title, text, no]) => <article key={title}><span>{no}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}</div></div></section>

        <section id="opportunities" className="opportunities section-dark"><div className="container-wide split"><Reveal><p className="kicker">THE INDEX / 10</p><h2>STOP SEARCHING<br /><em>EVERYWHERE.</em></h2><p className="lead">Discover grants, accelerators, competitions, fellowships, mentorship, training and other resources in one considered place.</p></Reveal><div className="opportunity-interface"><div className="interface-top"><span>C.A.N. / OPPORTUNITY INDEX</span><span>CONCEPT / NOT LIVE</span></div><div className="filter-row">{['COUNTRY', 'STAGE', 'TYPE', 'INDUSTRY', 'ELIGIBILITY', 'DEADLINE'].map(x => <button key={x}>{x} <span>+</span></button>)}</div><div className="interface-row"><strong>OPPORTUNITY</strong><strong>WHERE</strong><strong>WHEN</strong></div>{['The right next step', 'A room to learn', 'People who get it'].map((x, i) => <div className="interface-row interface-row--item" key={x}><span>0{i + 1}</span><b>{x}</b><span>GLOBAL</span><span>COMING SOON</span></div>)}</div></div></section>

        <section className="global section-cream"><div className="container-wide split"><Reveal><p className="kicker">THE WORLD / 11</p><h2>BUILT FOR PEOPLE<br /><em>EVERYWHERE.</em></h2><p className="lead">Where you start should not determine whether you get to try.</p><p>C.A.N. is being designed global by default. Every country belongs in the architecture. Where possible, we should explain what is available and help users find alternatives.</p></Reveal><div className="world-map"><Globe /><span className="world-map__caption">AFRICA / GLOBAL ACCESS</span></div></div></section>

        <section className="vision-grid section-dark"><div className="container-wide"><Reveal><p className="kicker">THE LONG VIEW / 12—15</p><h2>YOUR IDEA<br /><em>NEEDS A HOME.</em></h2></Reveal><div className="vision-grid__cards"><article><small>DOMAIN / CONCEPT</small><strong>YOURIDEA.COM <i>✓ AVAILABLE</i></strong><strong>YOURIDEA.AFRICA <i>✓ AVAILABLE</i></strong><p>Eventually, you shouldn't have to leave C.A.N. just to begin building your digital presence.</p></article><article><small>PROJECT COACH / CONCEPT</small><h3>NOT JUST TELLING<br />YOU WHAT TO DO.<br /><em>SHOWING YOU HOW.</em></h3><div className="progress"><span style={{ width: '68%' }} /></div><p>AI is a future assistant layer for next steps, learning and project review.</p></article><article><small>TRUST / PROGRESSIVE</small><div className="trust-levels">{['EXPLORER', 'IDENTITY VERIFIED', 'PROJECT VERIFIED', 'BUSINESS VERIFIED'].map((x, i) => <span key={x} className={i === 0 ? 'active' : ''}>{x}<b>{i + 1}</b></span>)}</div><p>Verification levels may unlock different capabilities. Sensitive documents stay private.</p></article></div></div></section>

        <section className="future section-cream"><Reveal><p className="kicker">THE FUTURE / 16</p><h2>WHAT IF ALL OF THIS<br /><em>COULD EXIST IN ONE PLACE?</em></h2><p className="lead">That's what we're building.</p></Reveal><div className="future__orbit">{['IDEAS', 'PEOPLE', 'KNOWLEDGE', 'TOOLS', 'PROJECTS', 'AI', 'SUPPORT', 'FUNDING'].map((x, i) => <span key={x} style={{ '--i': i }}>{x}</span>)}<strong>C.A.N.</strong></div></section>

        <section className="legal section-cream" id="terms"><div className="container-wide legal__grid"><article><p className="kicker">TERMS / ACCOUNT USE</p><h2>START WITH<br /><em>RESPECT.</em></h2><p>By creating an account, you agree to use C.A.N. to learn, build, connect and support responsibly. Do not impersonate people, share harmful content, misuse another person’s information or use C.A.N. for unlawful activity.</p><p>Features described as concepts or future vision are not currently live services. C.A.N. does not guarantee funding, investment, opportunities or outcomes.</p></article><article id="privacy"><p className="kicker">PRIVACY / YOUR DATA</p><h3>YOUR DATA<br /><em>IS YOURS.</em></h3><p>Profiles and projects should be private by default. You choose what to publish, who can contact you and what information is visible. Never post passwords, identity documents, payment details or other sensitive information publicly.</p><p>When authentication and storage are connected, C.A.N. should provide access, export, correction and deletion controls, clear consent records, reporting, blocking and secure handling for verification data.</p></article></div></section>

        <section className="closing section-dark"><Reveal><p className="kicker">THE INVITATION / 17</p><h2>YOU HAVE<br /><em>A CHANCE.</em></h2><h3>YOU CAN.</h3><p>Start with what you have.<br />Learn. Ask for help. Build.<br />Try. Fail if you must.<br />Get back up. Try again.</p><StartButton onStart={() => setOnboardingOpen(true)} /></Reveal><div className="closing__line">IF THE DOOR DOESN'T EXIST, <em>CREATE ONE.</em></div></section>
      </main>
      {onboardingOpen && <Onboarding initialError={callbackError} authenticated={authenticated} onClose={() => setOnboardingOpen(false)} onExplore={() => { setOnboardingOpen(false); setExploreOpen(true); }} onAuthenticated={enterDashboard} />}
      {profileOpen && <ProfileSetup role={selectedRole} onComplete={() => { setProfileOpen(false); setDashboardOpen(true); }} />}
      {dashboardOpen && <Dashboard role={selectedRole} onClose={() => setDashboardOpen(false)} />}
      {exploreOpen && <ExploreSpace onClose={() => setExploreOpen(false)} onStart={() => { setExploreOpen(false); setOnboardingOpen(true); }} />}
    </>
  );
}
