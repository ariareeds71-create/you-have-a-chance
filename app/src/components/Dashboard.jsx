import React, { useState } from 'react';
import './Dashboard.css';
import './Verification.css';
import './Security.css';
import './DashboardSocial.css';
import CommunityBoard from './CommunityBoard.jsx';
import { supabase } from '../lib/supabase.js';

const initialPosts = [];

function IdentityVerification({ onSubmit, onContinue }) {
  const [documentType, setDocumentType] = useState('passport');
  const [country, setCountry] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const ready = country.trim() && documentFile;
  return <div className="verification-gate" role="dialog" aria-modal="true" aria-labelledby="verification-title">
    <div className="verification-gate__panel"><p className="kicker">C.A.N. / PROTECTED ACCESS</p><h2 id="verification-title">VERIFY<br /><em>YOUR IDENTITY.</em></h2><p className="verification-gate__lede">Identity verification is required before you can post, message people or ask the community for help. Everyone is welcome. There is no country allowlist.</p>
      <div className="verification-privacy"><span>◉</span><div><strong>PRIVATE BY DESIGN</strong><small>Your document is sent only to a configured identity-verification provider. It must never be published to your profile or community feed.</small></div></div>
      <div className="document-types"><button className={documentType === 'passport' ? 'active' : ''} onClick={() => setDocumentType('passport')}>PASSPORT</button><button className={documentType === 'national-id' ? 'active' : ''} onClick={() => setDocumentType('national-id')}>NATIONAL ID</button></div>
      <label className="verification-field">ISSUING COUNTRY OR REGION<input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Enter any country or region" autoComplete="country-name" /></label>
      <label className="upload-field">DOCUMENT FILE<input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} /><span>{documentFile ? documentFile.name : 'Choose a clear JPG, PNG or PDF'}</span></label>
      <button className="button button--light" disabled={!ready} onClick={() => onSubmit({ documentType, country, fileName: documentFile.name })}>SUBMIT FOR PRIVATE REVIEW <span>↗</span></button>
      <button className="verification-continue" onClick={onContinue}>CONTINUE TO DASHBOARD / PARTICIPATION LOCKED</button>
      <p className="verification-note">C.A.N. does not store identity documents in this browser. A production launch requires encrypted storage, retention limits, consent records, access controls and a compliant verification provider available in the user’s country.</p>
    </div>
  </div>;
}

function SecurityCenter({ onClose, onSignOut }) {
  const [notice, setNotice] = useState('');
  const request = (message) => setNotice(message);
  return <div className="security-center" role="dialog" aria-modal="true" aria-labelledby="security-title">
    <div className="security-center__panel"><button className="security-center__close" onClick={onClose} aria-label="Close Security Center">×</button><p className="kicker">C.A.N. / PROTECTION</p><h2 id="security-title">YOUR DATA.<br /><em>YOUR CONTROL.</em></h2><p className="security-center__lede">C.A.N. is designed for global access, with privacy and safety controls that apply wherever you sign in. You decide what becomes public.</p>
      <div className="security-center__status"><span>✓</span><div><strong>SESSION PROTECTED</strong><small>Authentication is handled by Supabase Auth. This browser never receives a service-role key.</small></div></div>
      <div className="security-center__grid"><article><small>IDENTITY VERIFICATION</small><h3>PRIVATE<br /><em>BY DEFAULT.</em></h3><p>Identity documents should go directly to a compliant verification provider through an encrypted handoff. They must not be stored in posts, profiles, analytics or public storage.</p><button onClick={() => request('Verification controls will be available after the identity provider is connected.')}>VIEW VERIFICATION POLICY ↗</button></article><article><small>ACCOUNT CONTROLS</small><h3>CHOOSE<br /><em>WHAT YOU SHARE.</em></h3><p>Profiles, projects and messages need separate visibility controls. You can request an export, correction or deletion of your account data.</p><button onClick={() => request('Your data request has been noted. A production backend will process export and deletion requests securely.')}>REQUEST DATA EXPORT ↗</button><button onClick={() => request('Deletion requests require confirmation from the authenticated account email.')}>REQUEST ACCOUNT DELETION ↗</button></article><article><small>GLOBAL ACCESS</small><h3>OPEN<br /><em>WHEREVER YOU ARE.</em></h3><p>There is no hard-coded country allowlist. Sign-in is available globally, while identity providers and local law may affect verification availability.</p><button onClick={() => request('C.A.N. will show availability and alternatives instead of silently excluding a country.')}>VIEW REGIONAL SAFETY RULES ↗</button></article></div>
      {notice && <p className="security-center__notice">{notice}</p>}<div className="security-center__footer"><button className="security-center__signout" onClick={onSignOut}>SIGN OUT OF ALL C.A.N. SESSIONS</button><button className="button button--light" onClick={onClose}>RETURN TO DASHBOARD <span>↗</span></button></div>
    </div>
  </div>;
}

const roleViews = {
  "I'M BUILDING SOMETHING": { label: 'BUILDER', kicker: 'BUILD YOUR NEXT STEP', title: 'MAKE ROOM', accent: 'FOR THE NEXT STEP.', action: 'CREATE A POST' },
  'I WANT TO MENTOR': { label: 'MENTOR', kicker: 'SHARE WHAT YOU KNOW', title: 'MAKE YOUR KNOWLEDGE', accent: 'AVAILABLE.', action: 'OFFER GUIDANCE' },
  'I WANT TO COLLABORATE': { label: 'COLLABORATOR', kicker: 'FIND YOUR PEOPLE', title: 'BUILD', accent: 'TOGETHER.', action: 'FIND COLLABORATORS' },
  'I WANT TO SUPPORT': { label: 'SUPPORTER', kicker: 'BACK PROMISING WORK', title: 'HELP GOOD IDEAS', accent: 'MOVE FORWARD.', action: 'SUPPORT A PROJECT' },
};

export default function Dashboard({ onClose, role = "I'M BUILDING SOMETHING" }) {
  const [posts, setPosts] = useState(initialPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('required');
  const [securityOpen, setSecurityOpen] = useState(false);
  const roleView = roleViews[role] || roleViews["I'M BUILDING SOMETHING"];
  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    onClose();
  };
  const publish = () => {
    if (!postText.trim()) return;
    setPosts([{ author: 'You', label: 'BUILDER', text: postText.trim(), meta: 'Just now' }, ...posts]);
    setPostText('');
    setComposerOpen(false);
  };
  return (
    <div className="dashboard" role="dialog" aria-modal="true" aria-label="C.A.N. dashboard">
      <header className="dashboard__topbar"><a href="#top" className="dashboard__logo">C.A.N.</a><span className="dashboard__secure">PRIVATE SPACE / ACCESS CONTROLLED</span><div><button className="dashboard__icon" aria-label="Notifications">○</button><button className="dashboard__avatar" aria-label="Open profile">CN</button><button className="dashboard__exit" onClick={signOut}>SIGN OUT</button></div></header>
      <div className="dashboard__layout">
        <aside className="dashboard__sidebar"><p className="kicker">YOUR SPACE</p><button className="dashboard__nav active">Home <span>01</span></button><button className="dashboard__nav">My projects <span>02</span></button><button className="dashboard__nav">People <span>03</span></button><button className="dashboard__nav">Opportunities <span>04</span></button><button className="dashboard__nav">Messages <span>05</span></button><div className="dashboard__sidebottom"><p className="kicker">PROTECTION</p><div className="security-badge"><span>✓</span><div><strong>Private by default</strong><small>Your controls, your data.</small></div></div><button className="dashboard__nav" onClick={() => setSecurityOpen(true)}>Security Center <span>↗</span></button></div></aside>
        <main className="dashboard__main"><section className="profile-hero"><div className="profile-hero__cover" /><div className="profile-hero__body"><div className="profile-hero__avatar">YOU</div><div className="profile-hero__identity"><p className="kicker">{roleView.label} / C.A.N. MEMBER</p><h2>YOUR PROFILE</h2><p>Complete your profile in My Space.</p></div><button className="profile-hero__edit">EDIT PROFILE</button></div><nav className="dashboard-tabs" aria-label="Dashboard views"><button className="active">HOME</button><button>PROJECTS</button><button>PEOPLE</button><button>OPPORTUNITIES</button><button>ACTIVITY</button></nav></section><div className="dashboard__welcome"><div><p className="kicker">WELCOME BACK / {roleView.label}</p><h1>{roleView.title}<br /><em>{roleView.accent}</em></h1></div><button className="button button--light" disabled={verificationStatus !== 'verified'} onClick={() => setComposerOpen(true)}>{verificationStatus === 'verified' ? roleView.action : 'VERIFY TO PARTICIPATE'} <span>＋</span></button></div>
          {composerOpen && <section className="composer"><div className="composer__head"><strong>SHARE WITH YOUR C.A.N. SPACE</strong><button onClick={() => setComposerOpen(false)}>×</button></div><textarea autoFocus value={postText} onChange={(event) => setPostText(event.target.value)} placeholder="What are you building, learning or looking for?" maxLength={500} /><div className="composer__foot"><small>{postText.length}/500 · Be thoughtful. Keep sensitive information private.</small><button className="button button--light" onClick={publish} disabled={!postText.trim()}>PUBLISH</button></div></section>}<section className="dashboard-stats"><div><strong>01</strong><span>PROJECTS STARTED</span></div><div><strong>04</strong><span>PEOPLE IN YOUR CIRCLE</span></div><div><strong>∞</strong><span>ROOM TO GROW</span></div></section><CommunityBoard role={roleView.label} />
          <div className="dashboard__columns"><section><div className="feed-head"><h2>YOUR SPACE</h2><span>{roleView.kicker}</span></div>{posts.map((post, index) => <article className="post" key={`${post.text}-${index}`}><div className="post__top"><div className="post__avatar">{post.author === 'You' ? 'CN' : 'C.A.N.'}</div><div><strong>{post.author}</strong><span>{post.label} · {post.meta}</span></div><button aria-label="Post options">•••</button></div><p>{post.text}</p><div className="post__actions"><button>♡ SUPPORT</button><button>↗ CONNECT</button><button>▢ SAVE</button></div></article>)}</section><aside className="dashboard__rail"><section className="rail-card help-card"><p className="kicker">{roleView.label === 'SUPPORTER' ? 'SUPPORT A PROJECT' : 'ASK FOR HELP'}</p><h3>{roleView.label === 'MENTOR' ? <>YOUR EXPERIENCE<br /><em>CAN OPEN A DOOR.</em></> : <>YOU DON'T HAVE TO<br /><em>FIGURE IT OUT ALONE.</em></>}</h3><p>Find a useful connection, a second opinion or a next step inside C.A.N.</p><button className="button button--light" disabled={verificationStatus !== 'verified'} onClick={() => setHelpOpen(true)}>{verificationStatus === 'verified' ? roleView.action : 'VERIFY TO PARTICIPATE'} <span>↗</span></button></section><section className="rail-card"><p className="kicker">YOUR TRUST PATH</p><h3>BUILD TRUST<br /><em>AT YOUR PACE.</em></h3><div className="verify-list"><span className="done">{roleView.label} <b>✓</b></span><span>EMAIL VERIFIED <b>02</b></span><span className={verificationStatus === 'verified' ? 'done' : ''}>IDENTITY VERIFIED <b>{verificationStatus === 'verified' ? '✓' : '03'}</b></span><span>PROJECT VERIFIED <b>04</b></span></div><span className="verification-status">{verificationStatus === 'pending' ? 'REVIEW PENDING' : 'IDENTITY VERIFICATION REQUIRED'}</span></section><section className="rail-card security-card"><p className="kicker">DATA & SECURITY</p><h3>YOU ARE<br /><em>IN CONTROL.</em></h3><ul><li>Private profile controls</li><li>Clear consent history</li><li>Download or delete your data</li><li>Report and block tools</li></ul><button className="rail-link" onClick={() => setSecurityOpen(true)}>SECURITY CENTER ↗</button></section></aside></div>
        </main>
      </div>
      {helpOpen && <div className="help-modal"><div className="help-modal__panel"><button className="onboarding__close" onClick={() => setHelpOpen(false)} aria-label="Close help request">×</button><p className="kicker">ASK THE COMMUNITY</p><h2>WHAT DO YOU<br /><em>NEED HELP WITH?</em></h2><textarea value={helpText} onChange={(event) => setHelpText(event.target.value)} placeholder="Describe the next step you are trying to take. Do not share passwords, identity documents or financial information." /><button className="button button--light" onClick={() => setHelpOpen(false)} disabled={!helpText.trim()}>SAVE DRAFT <span>↗</span></button><small>Your draft stays private until you choose to publish it.</small></div></div>}
      {verificationStatus === 'required' && <IdentityVerification onSubmit={() => setVerificationStatus('pending')} onContinue={() => setVerificationStatus('pending')} />}
      {securityOpen && <SecurityCenter onClose={() => setSecurityOpen(false)} onSignOut={signOut} />}
    </div>
  );
}
