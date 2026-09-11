import React, { useEffect, useState } from 'react';
import CommunityBoard from './CommunityBoard.jsx';
import { supabase } from '../lib/supabase.js';
import { PAYMENT_PROVIDER, PLATFORM_FEE_PERCENTAGE, YOUTUBE_INGESTION_STATUS } from '../lib/config.js';
import './WorkspaceDashboard.css';
import './WorkspaceVerification.css';
import './WorkspaceProfile.css';

const navItems = [
  ['home', 'HOME'],
  ['explore', 'EXPLORE'],
  ['build', 'BUILD'],
  ['learn', 'LEARN'],
  ['opportunities', 'OPPORTUNITIES'],
  ['people', 'PEOPLE'],
  ['messages', 'MESSAGES'],
  ['space', 'MY SPACE'],
  ['settings', 'SETTINGS'],
];

const roleLabels = {
  "I'M BUILDING SOMETHING": 'BUILDER',
  'I WANT TO MENTOR': 'MENTOR',
  'I WANT TO COLLABORATE': 'COLLABORATOR',
  'I WANT TO SUPPORT': 'SUPPORTER',
};

const feedFilters = ['FOR YOU', 'FOLLOWING', 'BUILDING', 'LEARNING', 'OPPORTUNITIES', 'PEOPLE', 'EVENTS'];
const learningCategories = ['BUSINESS', 'ENTREPRENEURSHIP', 'ARTIFICIAL INTELLIGENCE', 'TECHNOLOGY', 'MARKETING', 'SALES', 'FINANCE', 'MONEY', 'LEADERSHIP', 'PERSONAL GROWTH', 'CAREER', 'CREATOR ECONOMY', 'BRANDING', 'PRODUCT DEVELOPMENT', 'NO-CODE', 'CODING', 'DESIGN', 'COMMUNICATION', 'NEGOTIATION', 'PRODUCTIVITY', 'FREELANCING', 'E-COMMERCE'];
const platformFeePercentage = PLATFORM_FEE_PERCENTAGE;

const resourceLibrary = [];
const eventList = [];
const mentorshipProfiles = [];
const opportunitySamples = [];

const personalSpaceContent = [
  { title: 'Profile', subtitle: 'Your public identity and interests' },
  { title: 'Posts', subtitle: 'Updates, questions, wins and learning' },
  { title: 'Projects', subtitle: 'Your work, progress and collaborators' },
  { title: 'Saved items', subtitle: 'Opportunities, resources, mentors and events' },
];

function VerificationPanel({ onClose, onSubmit }) {
  const [type, setType] = useState('PASSPORT');
  const [country, setCountry] = useState('');
  const [file, setFile] = useState(null);

  return (
    <div className="workspace-overlay">
      <section className="workspace-verify">
        <button className="workspace-overlay__close" onClick={onClose}>�</button>
        <p className="workspace-kicker">TRUST / PRIVATE REVIEW</p>
        <h2>VERIFY<br /><em>WHEN READY.</em></h2>
        <p>Verification is separate from your public profile. Your document is never shown to people or stored in public project files.</p>
        <div className="workspace-verify__types">
          <button className={type === 'PASSPORT' ? 'active' : ''} onClick={() => setType('PASSPORT')}>PASSPORT</button>
          <button className={type === 'NATIONAL ID' ? 'active' : ''} onClick={() => setType('NATIONAL ID')}>NATIONAL ID</button>
        </div>
        <label>ISSUING COUNTRY OR REGION<input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Any country or region" /></label>
        <label>PRIVATE DOCUMENT FILE<input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
        <button className="workspace-button workspace-button--primary" disabled={!country || !file} onClick={() => onSubmit()}>SUBMIT FOR PRIVATE REVIEW ?</button>
        <small>C.A.N. uses compliant verification and retention limits before production launch. Participation stays locked until review is complete.</small>
      </section>
    </div>
  );
}

function EmptyState({ eyebrow, title, children, action, onAction, secondary, onSecondary }) {
  return (
    <div className="workspace-empty">
      <span className="workspace-empty__mark">+</span>
      <p className="workspace-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
      <div className="workspace-empty__actions">
        {action && <button className="workspace-button workspace-button--primary" onClick={onAction}>{action} <span>?</span></button>}
        {secondary && <button className="workspace-button workspace-button--quiet" onClick={onSecondary}>{secondary}</button>}
      </div>
    </div>
  );
}

function CreateProject({ onBack, onCreated }) {
  const [form, setForm] = useState({ title: '', problem: '', audience: '', stage: 'IDEA', help: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm({ ...form, [key]: value });

  const create = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.problem.trim()) return;
    setBusy(true); setError('');
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setError('Sign in before creating a project.'); setBusy(false); return; }
      const result = await supabase.from('projects').insert({ owner_id: data.user?.id, title: form.title.trim(), description: `${form.problem.trim()}\n\nFor: ${form.audience.trim()}\nStage: ${form.stage}\nHelp: ${form.help.trim()}` }).select().single();
      if (result.error) { setError(result.error.message); setBusy(false); return; }
      onCreated(result.data);
    } else {
      setError('Supabase is not configured. Your project was not saved.');
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  return (
    <section className="workspace-page">
      <button className="workspace-back" onClick={onBack}>? BACK TO PROJECTS</button>
      <div className="workspace-page__heading">
        <p className="workspace-kicker">PROJECTS / NEW</p>
        <h1>WHAT ARE YOU<br /><em>BUILDING?</em></h1>
        <p>Start with a clear first version. You can change the details later.</p>
      </div>
      <form className="project-form" onSubmit={create}>
        <label>PROJECT NAME<input required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="A name people can remember" /></label>
        <label>WHAT ARE YOU TRYING TO SOLVE?<textarea required value={form.problem} onChange={(e) => update('problem', e.target.value)} placeholder="Describe the problem in your own words." /></label>
        <label>WHO IS THIS FOR?<input value={form.audience} onChange={(e) => update('audience', e.target.value)} placeholder="The people you want to help" /></label>
        <label>WHAT STAGE ARE YOU AT?<select value={form.stage} onChange={(e) => update('stage', e.target.value)}>{['IDEA', 'EXPLORING', 'BUILDING', 'TESTING', 'LAUNCHING', 'GROWING'].map((stage) => <option key={stage}>{stage}</option>)}</select></label>
        <label>WHAT DO YOU NEED HELP WITH? <span>OPTIONAL</span><textarea value={form.help} onChange={(e) => update('help', e.target.value)} placeholder="People, skills, feedback, tools..." /></label>
        {error && <p className="workspace-error">{error}</p>}
        <div className="project-form__footer">
          <button type="button" className="workspace-button workspace-button--quiet" onClick={onBack}>CANCEL</button>
          <button className="workspace-button workspace-button--primary" disabled={busy}>{busy ? 'CREATING...' : 'CREATE PROJECT'} <span>?</span></button>
        </div>
      </form>
    </section>
  );
}

function ProjectsPage({ onCreate }) {
  const [view, setView] = useState('MY PROJECTS');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadProjects = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to load your projects.'); return; }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); setNotice('Sign in to manage projects.'); return; }
      const result = await supabase.from('projects').select('id, title, description, visibility, created_at').eq('owner_id', userData.user.id).order('created_at', { ascending: false });
      if (!active) return;
      setLoading(false);
      if (result.error) setNotice('We could not load your projects. Please try again.');
      else setProjects(result.data || []);
    };
    loadProjects();
    return () => { active = false; };
  }, []);
  const deleteProject = async (id) => {
    if (!supabase) return;
    const result = await supabase.from('projects').delete().eq('id', id);
    if (result.error) { setNotice('We could not delete that project. Please try again.'); return; }
    setProjects((current) => current.filter((project) => project.id !== id));
  };
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading workspace-page__heading--row">
        <div>
          <p className="workspace-kicker">YOUR WORK / PROJECTS</p>
          <h1>MAKE IT<br /><em>REAL.</em></h1>
          <p>Your projects, milestones, and collaborators live here.</p>
        </div>
        <button className="workspace-button workspace-button--primary" onClick={onCreate}>CREATE PROJECT <span>+</span></button>
      </div>
      <div className="projects-switch">
        <button className={view === 'MY PROJECTS' ? 'active' : ''} onClick={() => setView('MY PROJECTS')}>MY PROJECTS</button>
        <button className={view === 'DISCOVER PROJECTS' ? 'active' : ''} onClick={() => setView('DISCOVER PROJECTS')}>DISCOVER PROJECTS</button>
      </div>
      {notice && <p className="workspace-note">{notice}</p>}
      {view === 'DISCOVER PROJECTS' ? <EmptyState eyebrow={view} title="NO PUBLIC PROJECTS YET">Public projects will appear here when members choose to share them.</EmptyState> : loading ? <EmptyState eyebrow={view} title="LOADING PROJECTS">Your projects are being loaded from your account.</EmptyState> : projects.length === 0 ? <EmptyState eyebrow={view} title="NO PROJECTS YET" action="CREATE PROJECT" onAction={onCreate}>Your first idea does not need to be perfect. Give it a place to begin.</EmptyState> : <div className="sample-grid">{projects.map((project) => <article key={project.id} className="workspace-card"><p className="workspace-kicker">{project.visibility}</p><h3>{project.title}</h3><p>{project.description || 'No description yet.'}</p><button className="workspace-button workspace-button--quiet" onClick={() => deleteProject(project.id)}>DELETE PROJECT</button></article>)}</div>}
    </section>
  );
}

function SpacePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to load your profile.'); return; }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); setNotice('Sign in to view your space.'); return; }
      const result = await supabase.from('profiles').select('display_name, username, bio').eq('id', userData.user.id).single();
      if (!active) return;
      setLoading(false);
      if (result.error && result.error.code !== 'PGRST116') setNotice('We could not load your profile. Please try again.');
      if (result.data) { setName(result.data.display_name || ''); setUsername(result.data.username || ''); setBio(result.data.bio || ''); }
    };
    loadProfile();
    return () => { active = false; };
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (!supabase) { setNotice('Supabase is not configured. Your profile was not saved.'); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setNotice('Sign in before saving your profile.'); return; }
    const result = await supabase.from('profiles').update({ display_name: name.trim(), username: username.trim().toLowerCase(), bio: bio.trim() }).eq('id', userData.user.id);
    if (result.error) { setNotice(result.error.message.includes('duplicate') ? 'That username is already taken.' : 'We could not save your profile. Please try again.'); return; }
    setNotice('Profile saved. Verification is not required to edit your profile.');
    setEditing(false);
  };

  return (
    <section className="workspace-page">
      <div className="workspace-page__heading workspace-page__heading--row">
        <div>
          <p className="workspace-kicker">MY SPACE / YOUR ENVIRONMENT</p>
          <h1>THIS IS<br /><em>YOURS.</em></h1>
          <p>Build a space around who you are and what you are working toward.</p>
        </div>
        <button className="workspace-button workspace-button--secondary" onClick={() => setEditing(!editing)}>{editing ? 'CLOSE EDITOR' : 'EDIT PROFILE'}</button>
      </div>
      {loading ? <EmptyState eyebrow="MY SPACE" title="LOADING YOUR SPACE">Your profile is being loaded from your account.</EmptyState> : editing ? (
        <form className="profile-inline-editor" onSubmit={save}>
          <label>FULL NAME<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>USERNAME<input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} minLength={3} maxLength={30} required /></label>
          <label>BIO<textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={500} /></label>
          {notice && <p className="workspace-profile-editor__notice">{notice}</p>}
          <button className="workspace-button workspace-button--primary">SAVE PROFILE <span>?</span></button>
        </form>
      ) : (
        <>
          <div className="space-profile">
            <div className="space-profile__avatar">CN</div>
            <div>
              <h2>{name}</h2>
              <p>{username ? `@${username}` : 'Profile setup not finished'} / {roleLabels["I'M BUILDING SOMETHING"]}</p>
              <p>{bio || 'Add a bio to tell people what you are building, learning, or here to help with.'}</p>
            </div>
          </div>
          <div className="space-columns">
            {personalSpaceContent.map((item) => (
              <div key={item.title} className="workspace-card">
                <p className="workspace-kicker">{item.title}</p>
                <h3>{item.subtitle}</h3>
                <button className="workspace-button workspace-button--quiet" onClick={() => setNotice(`${item.title} will appear here as you add activity to your C.A.N. space.`)}>VIEW ↗</button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('BUSINESS');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadResources = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to load learning resources.'); return; }
      const result = await supabase.from('resources').select('id, title, source_type, original_url, description, publisher, category, difficulty, source_attribution').eq('approval_status', 'approved').order('created_at', { ascending: false });
      if (!active) return;
      setLoading(false);
      if (result.error) setNotice('We could not load approved learning resources.');
      else setResources(result.data || []);
    };
    loadResources();
    return () => { active = false; };
  }, []);
  const filtered = resources.filter((resource) => !resource.category || selectedCategory === 'BUSINESS' || resource.category.toUpperCase() === selectedCategory);

  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">LEARN / EDUCATION</p>
        <h1>KEEP MOVING<br /><em>FORWARD.</em></h1>
        <p>Discover useful learning resources, seminars, workshops and relevant educational content from original creators.</p>
        <p className="workspace-note">YouTube ingestion: {YOUTUBE_INGESTION_STATUS === 'configured' ? 'connected to the configured API.' : 'awaiting official API configuration. Only approved, attributed resources are shown.'}</p>
        {notice && <p className="workspace-note">{notice}</p>}
      </div>
      <div className="discovery-filters" style={{ marginBottom: 18 }}>
        {learningCategories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category} <span>+</span></button>
        ))}
      </div>
      <div className="sample-grid">
        {loading && <EmptyState eyebrow="LEARN" title="LOADING RESOURCES">Approved educational resources are being loaded.</EmptyState>}
        {!loading && filtered.length === 0 && <EmptyState eyebrow="LEARN" title="NO RESOURCES YET">Trusted educational resources will appear here when they are added from an approved source.</EmptyState>}
        {filtered.map((resource) => (
          <article key={resource.id} className="workspace-card" style={{ overflow: 'hidden', padding: 0 }}>
            {resource.thumbnail && <img src={resource.thumbnail} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />}
            <div style={{ padding: 18 }}>
              <small>{resource.source_type.toUpperCase()}</small>
              <h3 style={{ margin: '12px 0 8px' }}>{resource.title}</h3>
              <p style={{ color: 'var(--can-secondary)' }}>{resource.description || 'Description not provided by the source.'}</p>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--can-accent-soft)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>{resource.publisher || 'Publisher not provided'}</span>
                <span>{resource.difficulty || 'Level not provided'}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                <button className="workspace-button workspace-button--primary" onClick={() => window.open(resource.original_url, '_blank', 'noopener,noreferrer')}>OPEN ORIGINAL SOURCE</button>
                <small>{resource.source_attribution || 'Original source retained'}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpportunityDetail({ opportunity, onBack }) {
  return (
    <section className="workspace-page">
      <button className="workspace-back" onClick={onBack}>← BACK TO DISCOVERY</button>
      <div className="workspace-page__heading">
        <p className="workspace-kicker">OPPORTUNITY / {opportunity.type}</p>
        <h1>{opportunity.title}<br /><em>DETAILS.</em></h1>
        <p>This is a seeded discovery record for interface testing. It has not been verified as a live programme.</p>
      </div>
      <div className="sample-grid">
        <article className="workspace-card"><p className="workspace-kicker">REACH</p><h3>{opportunity.region}</h3><p>Intended audience: {opportunity.stage} stage builders and creators.</p></article>
        <article className="workspace-card"><p className="workspace-kicker">DEADLINE</p><h3>{opportunity.deadline}</h3><p>Deadline requires confirmation from the original publisher before applying.</p></article>
        <article className="workspace-card"><p className="workspace-kicker">SOURCE STATUS</p><h3>NOT VERIFIED</h3><p>C.A.N. will show the original application URL once trusted source ingestion is connected.</p></article>
      </div>
      <div className="workspace-card" style={{ marginTop: 18 }}>
        <p className="workspace-kicker">NEXT STEP</p>
        <h3>REVIEW ELIGIBILITY BEFORE APPLYING</h3>
        <p>Do not treat this seeded record as funding, an endorsement, or a guarantee. Save it while you wait for a verified source.</p>
        <button className="workspace-button workspace-button--quiet" onClick={onBack}>RETURN TO OPPORTUNITIES</button>
      </div>
    </section>
  );
}

function ExplorePage({ onViewOpportunity }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">EXPLORE / COMMUNITY</p>
        <h1>DISCOVER<br /><em>WHAT'S POSSIBLE.</em></h1>
        <p>People, projects, learning resources, events, mentors, services and opportunities in one place.</p>
      </div>
      <div className="people-search" style={{ marginBottom: 18 }}>
        <input placeholder="Search people, projects, resources, events..." />
        <div>
          {['PEOPLE', 'PROJECTS', 'RESOURCES', 'EVENTS', 'MENTORS', 'SERVICES', 'OPPORTUNITIES'].map((item) => <button key={item} className={activeFilter === item ? 'active' : ''} onClick={() => setActiveFilter(item)}>{item}</button>)}
        </div>
      </div>
      <div className="sample-grid">
        {opportunitySamples.length === 0 && <EmptyState eyebrow="EXPLORE" title="C.A.N. IS JUST GETTING STARTED">There are no public discovery records yet. Create a project or publish something useful to begin.</EmptyState>}
        {opportunitySamples.map((item) => (
          <article key={item.title} className="workspace-card">
            <small>{item.type}</small>
            <h3>{item.title}</h3>
            <p>{item.region} � {item.deadline}</p>
            <button className="workspace-button workspace-button--quiet" onClick={() => onViewOpportunity(item)}>VIEW DETAILS ↗</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpportunitiesPage({ onViewOpportunity }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadOpportunities = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to load opportunities.'); return; }
      const result = await supabase.from('opportunities').select('id, title, organization, opportunity_type, country_codes, deadline, eligibility, source_url').order('deadline', { ascending: true });
      if (!active) return;
      setLoading(false);
      if (result.error) setNotice('We could not load verified opportunities.');
      else setOpportunities((result.data || []).map((item) => ({ ...item, type: item.opportunity_type.toUpperCase(), region: item.country_codes?.join(', ') || 'Global eligibility not specified', stage: item.eligibility || 'Eligibility not specified', deadline: item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline provided' })));
    };
    loadOpportunities();
    return () => { active = false; };
  }, []);
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">OPPORTUNITIES / DISCOVERY</p>
        <h1>FIND A DOOR.<br /><em>OR BUILD ONE.</em></h1>
        <p>Global and local opportunities, supports, events, scholarships, grants and pathways.</p>
        {notice && <p className="workspace-note">{notice}</p>}
      </div>
      <div className="discovery-filters">
        {['COUNTRY', 'REGION', 'STAGE', 'INDUSTRY', 'TYPE', 'ELIGIBILITY', 'DEADLINE', 'COST'].map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter} <span>+</span></button>)}
      </div>
      <div className="sample-grid">
        {loading && <EmptyState eyebrow="OPPORTUNITIES" title="LOADING OPPORTUNITIES">Verified records are being loaded.</EmptyState>}
        {!loading && opportunities.length === 0 && <EmptyState eyebrow="OPPORTUNITIES" title="NO MATCHING OPPORTUNITIES">Verified opportunity records will appear here when trusted sources are connected.</EmptyState>}
        {opportunities.map((item) => (
          <article key={item.title} className="workspace-card">
            <small>{item.type}</small>
            <h3>{item.title}</h3>
            <p>{item.region} � {item.deadline}</p>
            <button className="workspace-button workspace-button--primary" onClick={() => onViewOpportunity(item)}>VIEW DETAILS ↗</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function PeoplePage() {
  const [notice, setNotice] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const loadPeople = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to discover people.'); return; }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); setNotice('Sign in to discover people.'); return; }
      const result = await supabase.rpc('list_public_profiles');
      if (!active) return;
      setLoading(false);
      if (result.error) setNotice('We could not load people yet. Apply the latest Supabase schema and try again.');
      else setPeople((result.data || []).map((person) => ({ id: person.id, name: person.display_name || person.username || 'C.A.N. member', expertise: person.bio || 'C.A.N. member', type: (person.role || 'MEMBER').toUpperCase(), nextSlot: 'Availability not provided' })));
    };
    loadPeople();
    return () => { active = false; };
  }, []);
  const connect = async (person) => {
    if (!supabase) { setNotice('Supabase is not configured. The connection request was not sent.'); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setNotice('Sign in before sending a connection request.'); return; }
    const result = await supabase.from('connections').insert({ requester_id: userData.user.id, recipient_id: person.id });
    if (result.error) { setNotice(result.error.code === '23505' ? 'You already sent a connection request.' : 'We could not send the connection request. Please try again.'); return; }
    setNotice(`Connection request sent to ${person.name}.`);
  };
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">PEOPLE / NETWORK</p>
        <h1>FIND YOUR<br /><em>PEOPLE.</em></h1>
        <p>Discover builders, mentors, collaborators, creators and supporters by interest, expertise or location.</p>
      </div>
      <div className="people-search">
        <input placeholder="Search people by name, skill, industry, country..." />
        <div>{['BUILDERS', 'MENTORS', 'COLLABORATORS', 'CREATORS', 'SUPPORTERS'].map((item) => <button key={item} className={activeFilter === item ? 'active' : ''} onClick={() => setActiveFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="sample-grid">
        {loading && <EmptyState eyebrow="PEOPLE" title="LOADING PEOPLE">Registered C.A.N. profiles are being loaded.</EmptyState>}
        {!loading && people.length === 0 && <EmptyState eyebrow="PEOPLE" title="YOUR NETWORK STARTS HERE">There are no other registered C.A.N. members to show yet.</EmptyState>}
        {people.map((mentor) => (
          <article key={mentor.name} className="workspace-card">
            <p className="workspace-kicker">{mentor.type}</p>
            <h3>{mentor.name}</h3>
            <p>{mentor.expertise}</p>
            <small>Next slot: {mentor.nextSlot}</small>
            <button className="workspace-button workspace-button--primary" onClick={() => connect(mentor)}>CONNECT ↗</button>
          </article>
        ))}
      </div>
      {notice && <p className="workspace-note" style={{ marginTop: 18 }}>{notice}</p>}
    </section>
  );
}

function MessagesPage() {
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">MESSAGES / COMMUNICATION</p>
        <h1>KEEP THE<br /><em>CONVERSATION MOVING.</em></h1>
        <p>Messages remain focused on collaboration, mentorship, help and shared progress.</p>
      </div>
      <EmptyState eyebrow="MESSAGES" title="NO CONVERSATIONS YET">When a connection or mentor replies, the conversation will appear here.</EmptyState>
    </section>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      if (!supabase) { setLoading(false); setNotice('Connect Supabase to load notifications.'); return; }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); setNotice('Sign in to view notifications.'); return; }
      const result = await supabase.from('notifications').select('id, kind, title, body, created_at').eq('user_id', userData.user.id).order('created_at', { ascending: false }).limit(50);
      if (!active) return;
      setLoading(false);
      if (result.error) setNotice('We could not load notifications. Please try again.');
      else setNotifications(result.data || []);
    };
    loadNotifications();
    return () => { active = false; };
  }, []);
  return <section className="workspace-page"><div className="workspace-page__heading"><p className="workspace-kicker">NOTIFICATIONS / ACTIVITY</p><h1>YOUR<br /><em>ACTIVITY.</em></h1><p>Notifications are generated from real messages, follows, connections, events, learning, opportunities, payments, and mentorship activity.</p></div>{notice && <p className="workspace-note">{notice}</p>}{loading ? <EmptyState eyebrow="NOTIFICATIONS" title="LOADING NOTIFICATIONS">Your activity is being loaded.</EmptyState> : notifications.length === 0 ? <EmptyState eyebrow="NOTIFICATIONS" title="YOU ARE ALL CAUGHT UP">Real activity notifications will appear here.</EmptyState> : <div className="sample-grid">{notifications.map((notification) => <article key={notification.id} className="workspace-card"><p className="workspace-kicker">{notification.kind}</p><h3>{notification.title}</h3><p>{notification.body || 'No additional details.'}</p><small>{new Date(notification.created_at).toLocaleString()}</small></article>)}</div>}</section>;
}

function SettingsPage({ onNavigate }) {
  const [section, setSection] = useState(null);
  const [personalization, setPersonalization] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState('');
  useEffect(() => {
    let active = true;
    const loadPreferences = async () => {
      if (!supabase) return;
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const result = await supabase.from('user_preferences').select('personalization_enabled, marketing_notifications').eq('profile_id', userData.user.id).maybeSingle();
      if (active && result.data) { setPersonalization(result.data.personalization_enabled); setMarketing(result.data.marketing_notifications); }
    };
    loadPreferences();
    return () => { active = false; };
  }, []);
  const savePreferences = async (changes) => {
    setSettingsNotice('');
    if (!supabase) { setSettingsNotice('Connect Supabase before saving settings.'); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setSettingsNotice('Sign in before saving settings.'); return; }
    setSaving(true);
    const result = await supabase.from('user_preferences').upsert({ profile_id: userData.user.id, personalization_enabled: personalization, marketing_notifications: marketing, ...changes, updated_at: new Date().toISOString() });
    setSaving(false);
    setSettingsNotice(result.error ? 'We could not save this setting. Please try again.' : 'Setting saved.');
  };
  if (section) {
    const sectionCopy = {
      Account: ['ACCOUNT', 'Manage your profile identity and account access.', 'Open My Space to edit your public profile.'],
      Privacy: ['PRIVACY', 'You control what is public in C.A.N.', 'New profiles and projects remain private until you choose to share them.'],
      Notifications: ['NOTIFICATIONS', 'Choose which updates reach you.', 'Message, event, opportunity and payment notifications are available when those services are connected.'],
      'Payments & Payouts': ['PAYMENTS & PAYOUTS', 'Review provider-backed payment settings.', 'C.A.N. does not store card details or create internal balances.'],
      Verification: ['VERIFICATION', 'Trust levels are separate from your public profile.', 'Identity documents are private and require a compliant provider before review can be live.'],
      Help: ['HELP', 'Get support or ask the community for a next step.', 'Use the support area to route a focused request.'],
    }[section];
    return <section className="workspace-page"><button className="workspace-back" onClick={() => setSection(null)}>← BACK TO SETTINGS</button><div className="workspace-page__heading"><p className="workspace-kicker">SETTINGS / {sectionCopy[0]}</p><h1>{sectionCopy[1]}</h1><p>{sectionCopy[2]}</p></div>{section === 'Account' && <button className="workspace-button workspace-button--primary" onClick={() => onNavigate('space')}>EDIT MY SPACE ↗</button>}{section === 'Payments & Payouts' && <button className="workspace-button workspace-button--primary" onClick={() => onNavigate('payments')}>OPEN PAYMENT SETTINGS ↗</button>}{section === 'Verification' && <button className="workspace-button workspace-button--primary" onClick={() => onNavigate('verification')}>OPEN VERIFICATION ↗</button>}{section === 'Help' && <button className="workspace-button workspace-button--primary" onClick={() => onNavigate('help')}>OPEN SUPPORT ↗</button>}{section === 'Privacy' && <div className="workspace-card" style={{ marginTop: 18 }}><label className="workspace-toggle"><input type="checkbox" checked={personalization} disabled={saving} onChange={(event) => { const value = event.target.checked; setPersonalization(value); savePreferences({ personalization_enabled: value }); }} /> Allow recommendations based on my saved activity</label><p className="workspace-note">Only voluntary product activity is used. You can turn personalization off at any time.</p></div>}{section === 'Notifications' && <div className="workspace-card" style={{ marginTop: 18 }}><label className="workspace-toggle"><input type="checkbox" checked={marketing} disabled={saving} onChange={(event) => { const value = event.target.checked; setMarketing(value); savePreferences({ marketing_notifications: value }); }} /> Receive occasional C.A.N. product updates</label><p className="workspace-note">Transactional messages such as security and payment updates remain separate.</p></div>}{settingsNotice && <p className="workspace-note" style={{ marginTop: 18 }}>{settingsNotice}</p>}</section>;
  }
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">SETTINGS / ACCOUNT</p>
        <h1>YOUR ACCOUNT.<br /><em>YOUR RULES.</em></h1>
        <p>Profile, privacy, security, payments, payouts, verification, connected accounts and preferences.</p>
      </div>
      <div className="sample-grid">
        {['Account', 'Privacy', 'Notifications', 'Payments & Payouts', 'Verification', 'Help'].map((item) => (
          <article key={item} className="workspace-card">
            <p className="workspace-kicker">C.A.N. / SETTINGS</p>
            <h3>{item}</h3>
            <button className="workspace-button workspace-button--quiet" onClick={() => setSection(item)}>MANAGE ↗</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EarningsPage() {
  const [notice, setNotice] = useState('');
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">EARNINGS / CREATOR</p>
        <h1>YOUR EARNINGS.<br /><em>WHEN THEY ARRIVE.</em></h1>
        <p>Your earnings will appear here when you start earning through C.A.N. Real payouts are connected through the payment provider when configured.</p>
      </div>
      <EmptyState eyebrow="EARNINGS" title="NO EARNINGS YET">Your earnings will appear here when you start earning through C.A.N. Real provider data is required before balances or transactions are shown.</EmptyState>
      <div className="workspace-card" style={{ marginTop: 18 }}>
        <p className="workspace-kicker">PAYMENTS</p>
        <h3>CONNECT PAYOUT ACCOUNT</h3>
        <p>When the payment provider is connected, this area will display real earnings, transactions and payout status.</p>
        <button className="workspace-button workspace-button--primary" onClick={() => setNotice('Payout onboarding is unavailable until the payment provider is connected server-side. No payout account was created.')}>CONNECT PAYOUT ACCOUNT</button>
        {notice && <p className="workspace-note" style={{ marginTop: 14 }}>{notice}</p>}
      </div>
    </section>
  );
}

function PaymentSettingsPage() {
  const finalFee = (100 * platformFeePercentage).toFixed(1);
  const [notice, setNotice] = useState('');

  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">SETTINGS / PAYMENTS</p>
        <h1>PAYMENTS &<br /><em>PAYOUTS.</em></h1>
        <p>Transparent pricing, payout settings and transaction status protected by the payment provider.</p>
        <p className="workspace-note">Payment provider: {PAYMENT_PROVIDER === 'not-connected' ? 'not connected yet. No checkout or payout is represented as live.' : PAYMENT_PROVIDER}.</p>
      </div>
      <div className="workspace-card" style={{ marginBottom: 18 }}>
        <p className="workspace-kicker">PLATFORM FEE</p>
        <h3>{finalFee}% configured centrally</h3>
        <p>Transparent fee handling is required for all paid transactions. Customers and creators must see the platform fee before final confirmation.</p>
      </div>
      <div className="sample-grid">
        {['Payment methods', 'Payout account', 'Transaction history', 'Payout history', 'Refunds', 'Payment notifications'].map((item) => (
          <article key={item} className="workspace-card">
            <p className="workspace-kicker">C.A.N.</p>
            <h3>{item}</h3>
            <button className="workspace-button workspace-button--quiet" onClick={() => setNotice(`${item} is ready for provider integration. No payment data is stored in this browser.`)}>MANAGE ↗</button>
          </article>
        ))}
      </div>
      {notice && <p className="workspace-note" style={{ marginTop: 18 }}>{notice}</p>}
    </section>
  );
}

function GetHelpPage() {
  const [notice, setNotice] = useState('');
  return (
    <section className="workspace-page">
      <div className="workspace-page__heading">
        <p className="workspace-kicker">SUPPORT / HELP</p>
        <h1>YOU DO NOT<br /><em>HAVE TO FIGURE IT OUT ALONE.</em></h1>
        <p>Ask for help, offer help, mentor, connect or discover useful guidance from the community.</p>
      </div>
      <div className="sample-grid">
        {[
          ['I NEED HELP', 'I need someone to review my business idea.'],
          ['I NEED A DESIGNER', 'I need a designer for a pitch deck.'],
          ['I NEED A MENTOR', 'I need strategic feedback for the next step.'],
          ['I WANT TO OFFER HELP', 'I can offer feedback, introductions or guidance.'],
        ].map(([title, text]) => (
          <article key={title} className="workspace-card">
            <p className="workspace-kicker">HELP</p>
            <h3>{title}</h3>
            <p>{text}</p>
            <button className="workspace-button workspace-button--primary" onClick={() => setNotice(`${title} is ready to post to the community. Open CREATE → ASK or OFFER HELP to publish it.`)}>START ↗</button>
          </article>
        ))}
      </div>
      {notice && <p className="workspace-note" style={{ marginTop: 18 }}>{notice}</p>}
    </section>
  );
}

function CreateModal({ onClose, onSelectType }) {
  const actions = [
    ['POST', 'Share an update, idea, question or reflection.'],
    ['ASK', 'Ask for advice, feedback or a perspective.'],
    ['RESOURCE', 'Share a YouTube video, article or guide.'],
    ['PROJECT', 'Create a project and roadmap.'],
    ['OPPORTUNITY', 'Share an opportunity, event or pathway.'],
    ['EVENT', 'Host a seminar, workshop or masterclass.'],
    ['COURSE', 'Create a structured course with lessons and progress.'],
    ['WORKSHOP', 'Host a practical workshop for a focused audience.'],
    ['SEMINAR', 'Host a seminar and share useful knowledge.'],
    ['MASTERCLASS', 'Host a paid or free masterclass.'],
    ['OFFER HELP', 'Offer support, guidance or resources.'],
    ['MENTORSHIP', 'Offer mentorship or request support.'],
    ['SERVICE', 'Offer a legitimate professional service.'],
  ];

  return (
    <div className="workspace-overlay" role="dialog" aria-modal="true" aria-label="Create content">
      <section className="workspace-verify" style={{ maxWidth: 920 }}>
        <button className="workspace-overlay__close" onClick={onClose}>�</button>
        <p className="workspace-kicker">CREATE / CONTRIBUTE</p>
        <h2>WHAT DO YOU<br /><em>WANT TO SHARE?</em></h2>
        <div className="sample-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 16 }}>
          {actions.map(([label, text]) => (
            <button key={label} className="workspace-card" onClick={() => onSelectType(label)} style={{ textAlign: 'left', cursor: 'pointer', color: 'inherit', background: 'var(--can-surface)' }}>
              <p className="workspace-kicker">{label}</p>
              <h3>{text}</h3>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function HomePage({ onCreate, onOpenProfile, onSetPage, requestedIntent }) {
  const [filter, setFilter] = useState('FOR YOU');

  return (
    <section className="workspace-home">
      <div className="workspace-home__welcome">
        <div>
          <p className="workspace-kicker">HOME / DISCOVERY</p>
          <h1>GOOD TO SEE YOU,<br /><em>YOUR NEXT STEP.</em></h1>
          <p>What is your next step?</p>
        </div>
        <div className="workspace-search">
          <span>?</span>
          <input placeholder="Search people, projects, opportunities..." />
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={onCreate}><b>+</b><span>CREATE</span></button>
        <button onClick={() => onSetPage('build')}><b>?</b><span>BUILD</span></button>
        <button onClick={() => onSetPage('learn')}><b>?</b><span>LEARN</span></button>
        <button onClick={() => onSetPage('opportunities')}><b>?</b><span>OPPORTUNITIES</span></button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0 18px' }}>
        {feedFilters.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'workspace-button workspace-button--primary' : 'workspace-button workspace-button--quiet'}>{item}</button>
        ))}
      </div>

      <div className="home-grid">
        <div>
          <section className="workspace-section-intro">
            <p className="workspace-kicker">THE C.A.N. FEED</p>
            <h2>WHAT'S MOVING<br /><em>THROUGH THE COMMUNITY.</em></h2>
          </section>
          <CommunityBoard role="BUILDER" requestedIntent={requestedIntent} />
        </div>

        <aside className="workspace-context">
          <div className="context-block">
            <p className="workspace-kicker">PROFILE COMPLETION</p>
            <h3>2 / 5</h3>
            <div className="completion-bar"><span /></div>
            <ul>
              <li className="done">Add profile photo</li>
              <li>Write a short bio</li>
              <li>Choose your interests</li>
              <li>Add your first project</li>
              <li>Connect with someone</li>
            </ul>
            <button onClick={onOpenProfile}>COMPLETE PROFILE ?</button>
          </div>

          <div className="context-block">
            <p className="workspace-kicker">RECOMMENDED FOR YOU</p>
            {samples.length === 0 ? <p className="workspace-note">Recommendations will appear after you save activity or follow a topic.</p> : samples.map(([labelText, title]) => <div className="recommendation" key={title}><small>{labelText}</small><strong>{title}</strong></div>)}
          </div>
        </aside>
      </div>
    </section>
  );
}

const samples = [];

export default function WorkspaceDashboard({ onClose, role }) {
  const [page, setPage] = useState('home');
  const [createProject, setCreateProject] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('NOT VERIFIED');
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState('POST');
  const [requestedIntent, setRequestedIntent] = useState('INTRODUCE');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [eventNotice, setEventNotice] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  useEffect(() => {
    if (page !== 'events' || !supabase) return;
    let active = true;
    setEventsLoading(true);
    supabase.from('events').select('id, title, event_type, host_id, starts_at, timezone, delivery, capacity, price_minor, currency_code').gte('starts_at', new Date().toISOString()).order('starts_at', { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      setEventsLoading(false);
      if (error) setEventNotice('We could not load events. Please try again.');
      else setEvents((data || []).map((event) => ({ id: event.id, title: event.title, type: event.event_type.toUpperCase(), host: 'C.A.N. host', date: new Date(event.starts_at).toLocaleDateString(), time: new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: event.timezone }), mode: event.delivery.toUpperCase(), seats: event.capacity || 'Open', price: (event.price_minor || 0) / 100, currency: event.currency_code })));
    });
    return () => { active = false; };
  }, [page]);
  const label = roleLabels[role] || 'MEMBER';

  useEffect(() => {
    if (verificationOpen) {
      setVerificationStatus('NOT VERIFIED');
    }
  }, [verificationOpen]);

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); onClose(); };

  const handleCreateType = (type) => {
    setCreateType(type);
    setCreateOpen(false);
    if (type === 'POST') {
      setRequestedIntent('BUILD');
      setPage('home');
      return;
    }
    if (type === 'ASK') {
      setRequestedIntent('HELP');
      setPage('home');
      return;
    }
    if (type === 'OFFER HELP') {
      setRequestedIntent('OFFER');
      setPage('home');
      return;
    }
    if (type === 'RESOURCE') {
      setPage('learn');
      return;
    }
    if (['EVENT', 'WORKSHOP', 'SEMINAR', 'MASTERCLASS'].includes(type)) {
      setPage('events');
      return;
    }
    if (type === 'COURSE') {
      setPage('learn');
      return;
    }
    if (type === 'SERVICE' || type === 'MENTORSHIP') {
      setPage('people');
      return;
    }
    if (type === 'PROJECT') {
      setCreateProject(true);
      return;
    }
    setPage('home');
  };

  let view;
  if (selectedOpportunity) {
    view = <OpportunityDetail opportunity={selectedOpportunity} onBack={() => setSelectedOpportunity(null)} />;
  } else if (createProject) {
    view = <CreateProject onBack={() => setCreateProject(false)} onCreated={() => { setCreateProject(false); setPage('build'); }} />;
  } else if (page === 'home') {
    view = <HomePage onCreate={() => setCreateOpen(true)} onOpenProfile={() => setShowProfile(true)} onSetPage={setPage} requestedIntent={requestedIntent} />;
  } else if (page === 'explore') {
    view = <ExplorePage onViewOpportunity={setSelectedOpportunity} />;
  } else if (page === 'build') {
    view = <ProjectsPage onCreate={() => setCreateProject(true)} />;
  } else if (page === 'learn') {
    view = <LearnPage />;
  } else if (page === 'opportunities') {
    view = <OpportunitiesPage onViewOpportunity={setSelectedOpportunity} />;
  } else if (page === 'people') {
    view = <PeoplePage />;
  } else if (page === 'messages') {
    view = <MessagesPage />;
  } else if (page === 'space') {
    view = <SpacePage />;
  } else if (page === 'settings') {
    view = <SettingsPage onNavigate={(target) => { if (target === 'verification') setVerificationOpen(true); else setPage(target); }} />;
  } else if (page === 'events') {
    view = (
      <section className="workspace-page">
        <div className="workspace-page__heading">
          <p className="workspace-kicker">EVENTS / SEMINARS</p>
          <h1>DISCOVER<br /><em>EVENTS THAT MOVE YOU.</em></h1>
          <p>Free and paid seminars, workshops, live sessions and masterclasses from creators and professionals.</p>
        </div>
        <div className="discovery-filters">
          {['FREE', 'PAID', 'ONLINE', 'IN-PERSON', 'SEMINARS', 'WORKSHOPS', 'MASTERCLASSES'].map((filter) => <button key={filter} className={eventFilter === filter ? 'active' : ''} onClick={() => setEventFilter(filter)}>{filter} <span>+</span></button>)}
        </div>
        <div className="sample-grid">
          {eventsLoading && <EmptyState eyebrow="EVENTS" title="LOADING EVENTS">Events created by registered C.A.N. members are being loaded.</EmptyState>}
          {!eventsLoading && events.length === 0 && <EmptyState eyebrow="EVENTS" title="NO EVENTS YET">Events created by registered C.A.N. members will appear here.</EmptyState>}
          {events.map((event) => (
            <article key={event.id} className="workspace-card">
              <small>{event.type}</small>
              <h3>{event.title}</h3>
              <p>{event.host} � {event.date} � {event.time}</p>
              <p>{event.mode} � {event.seats} seats</p>
              <strong>{event.price === 0 ? 'FREE' : `�${event.price}`}</strong>
              <button className="workspace-button workspace-button--primary" onClick={() => setEventNotice(event.price === 0 ? `Registration for “${event.title}” will be saved when event data is connected.` : `Checkout for “${event.title}” is unavailable until the payment provider is connected.`)}>{event.price === 0 ? 'REGISTER' : 'VIEW CHECKOUT'} ↗</button>
            </article>
          ))}
        </div>
        {eventNotice && <p className="workspace-note" style={{ marginTop: 18 }}>{eventNotice}</p>}
      </section>
    );
  } else if (page === 'earnings') {
    view = <EarningsPage />;
  } else if (page === 'payments') {
    view = <PaymentSettingsPage />;
  } else if (page === 'help') {
    view = <GetHelpPage />;
  } else if (page === 'notifications') {
    view = <NotificationsPage />;
  } else {
    view = <HomePage onCreate={() => setCreateOpen(true)} onOpenProfile={() => setShowProfile(true)} onSetPage={setPage} requestedIntent={requestedIntent} />;
  }

  return (
    <div className="workspace" role="dialog" aria-modal="true" aria-label="C.A.N. workspace">
      <header className="workspace-topbar">
        <button className="workspace-brand" onClick={() => setPage('home')}>C.A.N.<small>YOU CAN.</small></button>
        <div className="workspace-topbar__search"><span>?</span><input placeholder="Search people, projects, opportunities..." /></div>
        <div className="workspace-topbar__actions">
          <button aria-label="Notifications" onClick={() => setPage('notifications')}>○</button>
          <button className="workspace-button workspace-button--primary" onClick={() => setCreateOpen(true)} style={{ padding: '10px 16px', fontSize: 10 }}>CREATE</button>
          <button className="workspace-user" onClick={() => setMenuOpen(!menuOpen)}>
            <span>YOU</span><b>ACCOUNT</b><i>?</i>
          </button>
          {menuOpen && (
            <div className="workspace-menu">
              <button onClick={() => { setPage('space'); setMenuOpen(false); }}>My Profile</button>
              <button onClick={() => { setPage('space'); setMenuOpen(false); }}>My Space</button>
              <button onClick={() => { setPage('settings'); setMenuOpen(false); }}>Account Settings</button>
              <button onClick={() => { setPage('payments'); setMenuOpen(false); }}>Payments & Payouts</button>
              <button onClick={() => { setPage('earnings'); setMenuOpen(false); }}>Earnings</button>
              <button onClick={() => { setVerificationOpen(true); setMenuOpen(false); }}>Verification</button>
              <button onClick={() => { setPage('help'); setMenuOpen(false); }}>Support</button>
              <button onClick={signOut}>Log out</button>
            </div>
          )}
        </div>
      </header>

      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <p className="workspace-nav-label">C.A.N. / WORKSPACE</p>
          {navItems.map(([key, name]) => (
            <button key={key} className={page === key && !createProject && !selectedOpportunity ? 'active' : ''} onClick={() => { setPage(key); setCreateProject(false); setSelectedOpportunity(null); }}>{name}</button>
          ))}
          <div className="workspace-sidebar__bottom">
            <button className={page === 'earnings' ? 'active' : ''} onClick={() => setPage('earnings')}>EARNINGS</button>
            <button className={page === 'help' ? 'active' : ''} onClick={() => setPage('help')}>HELP</button>
            <button onClick={signOut}>LOG OUT</button>
          </div>
        </aside>

        <main className="workspace-main">{view}</main>
      </div>

      <nav className="workspace-mobile-nav">
        {[['home', 'HOME'], ['explore', 'EXPLORE'], ['build', 'BUILD'], ['learn', 'LEARN'], ['space', 'MY SPACE']].map(([key, name]) => (
          <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}>{name}</button>
        ))}
      </nav>

      {verificationOpen && <VerificationPanel onClose={() => setVerificationOpen(false)} onSubmit={() => { setVerificationStatus('PENDING REVIEW'); setVerificationOpen(false); }} />}
      {showProfile && <div className="workspace-overlay"><section className="workspace-verify"><button className="workspace-overlay__close" onClick={() => setShowProfile(false)}>�</button><p className="workspace-kicker">PROFILE / COMPLETE</p><h2>MAKE IT<br /><em>YOURS.</em></h2><p>Build your profile, add your interests, and share the resources and projects you care about.</p><button className="workspace-button workspace-button--primary" onClick={() => setShowProfile(false)}>SAVE PROFILE</button></section></div>}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onSelectType={handleCreateType} />}
    </div>
  );
}
